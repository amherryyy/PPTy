# Six-table simplified Duno ERD

This is a deliberately simplified **core study-flow** ERD, not the complete application schema and not a fresh production database export. It includes the user owner plus five student-study tables: `users`, `subjects`, `topics`, `study_plans`, `study_plan_items`, `study_sessions`. `users` is provided by CodeIgniter Shield; the six-table view abstracts it to the parent identity table and omits auth identities/groups.

```mermaid
erDiagram
    USERS ||--o{ SUBJECTS : owns
    SUBJECTS ||--o{ TOPICS : contains
    USERS ||--o{ STUDY_PLANS : owns
    STUDY_PLANS ||--o{ STUDY_PLAN_ITEMS : contains
    TOPICS o|--o{ STUDY_PLAN_ITEMS : optional_topic_snapshot
    USERS ||--o{ STUDY_SESSIONS : records
    SUBJECTS ||--o{ STUDY_SESSIONS : classifies
    TOPICS o|--o{ STUDY_SESSIONS : optional_topic

    USERS {
      int id PK
    }
    SUBJECTS {
      int id PK
      int user_id FK
      varchar name
      varchar program_id nullable
    }
    TOPICS {
      int id PK
      int user_id FK
      int subject_id FK
      varchar title
      date due_date nullable
      varchar importance
      varchar difficulty
      varchar progress
    }
    STUDY_PLANS {
      int id PK
      int user_id FK
      date plan_date
      smallint available_minutes
    }
    STUDY_PLAN_ITEMS {
      int id PK
      int user_id FK
      int plan_id FK
      int topic_id FK nullable
      varchar topic_title_snapshot
      varchar subject_name_snapshot
      smallint duration_minutes
      time start_time nullable
      smallint position
    }
    STUDY_SESSIONS {
      int id PK
      int user_id FK
      int subject_id FK
      int topic_id FK nullable
      smallint duration_minutes
      datetime completed_at
    }
```

## Relationship authority and constraints

The authoritative source for intended Duno database relationships is the ordered migration code under `app/Database/Migrations/`, read together with Shield's installed auth migration. The paper ERD in `docs/system-design-paper-pack.md` is explanatory/secondary and should be reconciled to migrations if it differs. No live database was queried for this handoff, so deployed constraints are not asserted.

- `CreateSubjects.php`: `subjects.user_id -> users.id` (cascade); `(user_id,name)` lookup index.
- `CreateTopics.php`: `topics.subject_id -> subjects.id`; later `EnforceStudyPlanOwnership.php` backfills and requires `topics.user_id`, then adds `(user_id,subject_id) -> subjects(user_id,id)`; owner-scoped through the composite parent key.
- `CreateDailyPlans.php`: `study_plans.user_id -> users.id`; unique `(user_id,plan_date)`; `study_plan_items.plan_id -> study_plans.id` and optional topic FK are initially single-column.
- `EnforceStudyPlanOwnership.php`: adds `study_plan_items.user_id`, then composite `(user_id,plan_id) -> study_plans(user_id,id)` and `(user_id,topic_id) -> topics(user_id,id)`; this enforces shared ownership for MySQLi deployments. The item also stores topic/subject display snapshots. `topic_id` is nullable.
- `CreateStudySessions.php`, `AlignStudyHistoryForeignKeys.php`, and `EnforceStudySessionReferenceIntegrity.php`: session user -> users; composite `(user_id,subject_id) -> subjects(user_id,id)` and `(topic_id,subject_id) -> topics(id,subject_id)`. Session topic is optional. Saved sessions protect referenced history.

## Deliberate omissions

This six-table view omits `check_ins` (private optional student records), `student_streak_days`, `registration_verification_limits`, `password_reset_codes`, Shield's auth identities/groups, CodeIgniter settings/migration metadata, and code-defined academic catalogs. Don't imply the whole deployed schema has six tables. For a data/privacy slide, show `check_ins` separately and explain owner-only access; it is a real app table.

The full schema evidence note is `docs/DUNO_SYSTEM_ANALYSIS_EVIDENCE_REPORT.md` (schema and relationship sections); the concise design packet is `docs/system-design-paper-pack.md` section 4. These documents are not substitutes for migration code.

import bpy, math, os
from mathutils import Vector

OUT = os.path.dirname(os.path.abspath(__file__))
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)

def material(name, color, metallic=0.0, roughness=0.45):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = roughness
    return m

def cube(name, location, dimensions, mat, bevel=0.035):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if mat:
        ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new('Soft machined edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        norm = ob.modifiers.new('Weighted corner normals', 'WEIGHTED_NORMAL')
    return ob

def cylinder_between(name, start, end, radius, mat, vertices=48, bevel=0.012):
    a, b = Vector(start), Vector(end)
    direction = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=direction.length, location=(a+b)/2)
    ob = bpy.context.object
    ob.name = name
    ob.rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    if mat:
        ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new('Edge glint', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
        ob.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return ob

def uv_sphere(name, location, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return ob

def dish_mesh(name, center, radius, depth, mat):
    verts, faces = [], []
    rings, steps = 9, 64
    for ring in range(rings + 1):
        r = radius * ring / rings
        for step in range(steps):
            a = math.tau * step / steps
            verts.append((center[0] + r * math.cos(a),
                          center[1] + r * math.sin(a),
                          center[2] - depth * (r / radius) ** 2))
    for ring in range(rings):
        for step in range(steps):
            a = ring * steps + step
            b = ring * steps + (step + 1) % steps
            c = (ring + 1) * steps + (step + 1) % steps
            d = (ring + 1) * steps + step
            faces.append((a, b, c, d))
    mesh = bpy.data.meshes.new(name + ' surface')
    mesh.from_pydata(verts, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    ob = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(ob)
    solid = ob.modifiers.new('Dish shell thickness', 'SOLIDIFY')
    solid.thickness = 0.035
    bevel = ob.modifiers.new('Dish rim softness', 'BEVEL')
    bevel.width = 0.012
    bevel.segments = 2
    ob.modifiers.new('Dish normals', 'WEIGHTED_NORMAL')
    return ob

clear_scene()

# Restrained technical palette: ceramic navy, brushed metal, gold foil, cobalt cells.
graphite = material('Ceramic graphite', (0.035, 0.055, 0.095), 0.55, 0.27)
silver = material('Brushed aluminum', (0.34, 0.43, 0.54), 0.72, 0.31)
dark_metal = material('Titanium edges', (0.14, 0.20, 0.27), 0.82, 0.3)
gold = material('Thermal foil amber', (0.58, 0.24, 0.055), 0.68, 0.36)
pcb = material('Circuit board green', (0.025, 0.19, 0.14), 0.25, 0.38)
chip = material('Instrument ceramic', (0.08, 0.12, 0.18), 0.28, 0.22)
blue = material('Solar cell cobalt', (0.006, 0.035, 0.18), 0.52, 0.24)
blue_edge = material('Solar cell grid', (0.025, 0.14, 0.38), 0.38, 0.31)
glass = material('Optical glass', (0.035, 0.20, 0.42), 0.62, 0.14)
white = material('Ceramic white', (0.78, 0.84, 0.89), 0.18, 0.32)

# Open spacecraft bus with a deliberate cutaway to expose the internal stack.
cube('Central spacecraft bus', (0, 0.02, 0.22), (2.42, 1.75, 1.82), graphite, 0.10)
# Structural corner rails and cross-members.
for x in (-1.13, 1.13):
    for z in (-0.53, 0.93):
        cylinder_between('Machined frame rail', (x, -0.86, z), (x, 0.84, z), 0.055, silver)
for y in (-0.72, 0.72):
    for x in (-1.12, 1.12):
        cylinder_between('Bus corner strut', (x, y, -0.58), (x, y, 1.02), 0.055, silver)
# Top equipment deck, split to keep the cutaway visible.
cube('Rear top deck', (-0.45, 0.12, 1.17), (1.46, 1.45, 0.12), silver, 0.045)
cube('Foil top service panel', (0.66, 0.30, 1.17), (0.74, 1.12, 0.12), gold, 0.035)
# Foil side skin is pulled outward as a controlled exploded layer.
cube('Exploded thermal side skin', (1.63, 0.05, 0.22), (0.095, 1.38, 1.30), gold, 0.045)
for z in (-0.30, 0.72):
    for y in (-0.48, 0.50):
        uv_sphere('Side panel fastener', (1.69, y, z), (0.045, 0.045, 0.045), silver)

# Exposed avionics board and a layered stack of instrument modules.
cube('Avionics backplane', (0.02, -0.70, 0.22), (1.70, 0.105, 1.38), pcb, 0.035)
cube('Flight computer', (-0.38, -0.80, 0.38), (0.58, 0.19, 0.52), chip, 0.07)
cube('Processor top', (-0.38, -0.91, 0.38), (0.33, 0.045, 0.29), gold, 0.025)
cube('Power conditioning unit', (0.48, -0.82, 0.55), (0.48, 0.23, 0.68), silver, 0.06)
cube('Battery module', (0.48, -0.82, -0.20), (0.58, 0.23, 0.39), graphite, 0.055)
cube('Battery identification plate', (0.48, -0.95, -0.20), (0.28, 0.035, 0.18), gold, 0.018)
for x in (-0.88, -0.62, 0.04, 0.30, 0.72):
    for z in (-0.40, 0.78):
        uv_sphere('Board mounting screw', (x, -0.79, z), (0.035, 0.035, 0.035), silver)
# A few visible connector blocks around the board edge.
for z in (-0.38, 0.02, 0.43):
    cube('Harness connector', (-0.98, -0.83, z), (0.12, 0.18, 0.15), gold, 0.02)
# Cable runs: simple swept tubes made from cylinders with real volume.
cylinder_between('Harness run A', (-0.76, -0.95, 0.68), (-0.45, -0.95, 0.68), 0.025, gold, 20)
cylinder_between('Harness run B', (0.00, -0.94, -0.45), (0.40, -0.94, -0.35), 0.026, white, 20)

# Long optical payload with a multi-stage barrel and actual lens surfaces.
cylinder_between('Optical payload barrel', (-0.50, -0.76, 0.18), (-0.50, -2.34, 0.18), 0.36, graphite, 64, 0.025)
for y, radius, depth in ((-1.03, 0.405, 0.12), (-1.38, 0.385, 0.08), (-2.20, 0.425, 0.13)):
    cylinder_between('Optics retaining ring', (-0.50, y + depth/2, 0.18), (-0.50, y - depth/2, 0.18), radius, silver, 64, 0.018)
cylinder_between('Lens housing lip', (-0.50, -2.34, 0.18), (-0.50, -2.40, 0.18), 0.335, dark_metal, 64, 0.008)
cylinder_between('Coated objective lens', (-0.50, -2.405, 0.18), (-0.50, -2.432, 0.18), 0.285, glass, 64, 0.003)
uv_sphere('Optical glint', (-0.57, -2.437, 0.27), (0.095, 0.018, 0.07), white)

# Two deployed solar wings, each composed of two framed, tiled panels.
for side in (-1, 1):
    cylinder_between('Solar wing boom', (side*1.10, 0.05, 0.34), (side*1.42, 0.05, 0.34), 0.075, silver)
    for segment, cx_abs in enumerate((2.16, 3.72), start=1):
        cx = side * cx_abs
        cube('Solar panel substrate', (cx, 0.03, 0.34), (1.42, 1.24, 0.085), dark_metal, 0.045)
        cube('Cobalt photovoltaic field', (cx, 0.03, 0.392), (1.33, 1.15, 0.025), blue, 0.018)
        # Twelve clearly separated cells on each panel.
        for col in range(4):
            for row in range(3):
                px = cx - 0.50 + col * 0.335
                py = -0.34 + row * 0.37
                cube('Photovoltaic cell', (px, py, 0.410), (0.305, 0.335, 0.012), blue_edge, 0.006)
        # Perimeter rails add edge thickness and a readable frame.
        for yy in (-0.59, 0.65):
            cube('Solar panel long rail', (cx, yy, 0.425), (1.42, 0.035, 0.042), silver, 0.012)
        for xx in (cx - 0.71, cx + 0.71):
            cube('Solar panel end rail', (xx, 0.03, 0.425), (0.035, 1.25, 0.042), silver, 0.012)
    # Joint housings where panels meet the bus.
    uv_sphere('Solar wing hinge', (side*1.40, 0.05, 0.36), (0.12, 0.12, 0.12), gold)

# Directional high-gain dish on a short mast. The dish is a concave 3D surface.
cylinder_between('Antenna mast', (0.70, 0.46, 1.20), (0.70, 0.46, 1.78), 0.045, silver)
dish_mesh('Parabolic high-gain dish', (0.70, 0.46, 1.80), 0.48, 0.19, silver)
bpy.ops.mesh.primitive_torus_add(major_radius=0.475, minor_radius=0.022, major_segments=64, minor_segments=12, location=(0.70, 0.46, 1.80))
bpy.context.object.name = 'Dish rolled rim'
bpy.context.object.data.materials.append(gold)
cylinder_between('Dish feed support', (0.70, 0.46, 1.62), (0.70, 0.46, 1.81), 0.045, dark_metal)
uv_sphere('Dish feed horn', (0.70, 0.46, 1.83), (0.075, 0.075, 0.075), gold)

# Short telemetry whip and two small optical-bench supports.
cylinder_between('Telemetry antenna', (-0.91, 0.48, 1.17), (-1.03, 0.50, 2.00), 0.022, silver, 24)
cylinder_between('Payload support strut', (-0.93, -0.79, -0.43), (-0.68, -1.02, -0.18), 0.045, silver, 24)
cylinder_between('Payload support strut', (-0.08, -0.79, -0.43), (-0.32, -1.02, -0.18), 0.045, silver, 24)

# Scene, camera, lighting, and transparent render.
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
    scene.eevee.taa_render_samples = 96
scene.render.resolution_x = 2400
scene.render.resolution_y = 1600
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'
scene.render.film_transparent = True
scene.render.filepath = os.path.join(OUT, 'satellite.png')
scene.render.image_settings.compression = 15
scene.render.engine = 'BLENDER_EEVEE'
scene.view_settings.view_transform = 'AgX'

world = bpy.data.worlds.new('Midnight studio world') if not bpy.data.worlds else bpy.data.worlds[0]
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.045, 0.07, 0.14, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.32

def area_light(name, location, color, energy, size, target=(0, 0, 0.25)):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.color = color
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()
    return obj

area_light('Key softbox', (-4.5, -5.5, 7.0), (0.72, 0.84, 1.0), 1000, 5.0)
area_light('Cool fill', (5.0, -3.0, 3.7), (0.28, 0.50, 1.0), 620, 4.0)
area_light('Amber rim', (0.5, 4.5, 5.5), (1.0, 0.48, 0.18), 1100, 3.5)
area_light('Top strip', (-1.0, 0.0, 8.0), (0.82, 0.90, 1.0), 380, 3.0)

camera_data = bpy.data.cameras.new('Three-quarter technical camera')
camera = bpy.data.objects.new('Three-quarter technical camera', camera_data)
scene.collection.objects.link(camera)
camera.location = (7.6, -11.5, 8.0)
target = Vector((0, -0.05, 0.30))
camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 9.6
camera_data.lens = 50
scene.camera = camera
scene.render.image_settings.color_mode = 'RGBA'
scene.render.filepath = os.path.join(OUT, 'satellite.png')

# Save the editable source before rendering so geometry remains reusable.
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'satellite.blend'))
bpy.ops.render.render(write_still=True)
print('Saved original Blender model and transparent render in ' + OUT)



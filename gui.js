let gui = new dat.GUI();

let offsetFolder = gui.addFolder("Offset")
offsetFolder.add(options, 'x_offset', 0, 10000).name("X");
offsetFolder.add(options, 'y_offset', 0, 10000).name("Y");
offsetFolder.add(options, 'z_offset', 0, 10000).name("Z");
offsetFolder.open();

let scaleFolder = gui.addFolder("Scale")
scaleFolder.add(options, 'x_scale', 0.0001, 0.01).name("X Scale");
scaleFolder.add(options, 'y_scale', 0.0001, 0.01).name("Y Scale");
scaleFolder.add(options, 'z_scale', 0.0001, 0.01).name("Z Scale");
scaleFolder.open();

let fBmFolder = gui.addFolder("fBm")
fBmFolder.add(options, 'persistence', 1, 20).name("Persistence");
fBmFolder.add(options, 'octaves', 1, 20).name("Octaves");
fBmFolder.open();

gui.add(options, 'freeze').name("Freeze");






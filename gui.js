let gui = new dat.GUI();

let offsetFolder = gui.addFolder("Offset")
offsetFolder.add(options, 'x_offset', 0, 10000).name("X");
offsetFolder.add(options, 'y_offset', 0, 10000).name("Y");
offsetFolder.add(options, 'z_offset', 0, 10000).name("Z");
offsetFolder.open();

let scaleFolder = gui.addFolder("Scale")
scaleFolder.add(options, 'x_scale', 0.0001, 0.01).name("X Scale").step(0.0001);
scaleFolder.add(options, 'y_scale', 0.0001, 0.01).name("Y Scale").step(0.0001);
scaleFolder.add(options, 'z_scale', 0.0001, 0.01).name("Z Scale").step(0.0001);
scaleFolder.open();

let fBmFolder = gui.addFolder("fBm")
fBmFolder.add(options, 'persistence', 1, 20).name("Persistence").step(0.01);
fBmFolder.add(options, 'octaves', 1, 20).name("Octaves").step(1);
fBmFolder.open();

let cameraFolder = gui.addFolder("Camera");
cameraFolder.add(options,'lockCamera').name("Lock Camera");
cameraFolder.add(options,'resetCamera').name("Reset Camera");

let animationFolder = gui.addFolder("Animation")
animationFolder.add(options, 'offset_increment_scale', 1, 100).name("Speed").step(0.25);;
animationFolder.add(options, 'freeze').name("Freeze");
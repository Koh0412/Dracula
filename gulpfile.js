var gulp = require("gulp");
var packager = require("electron-packager");
var config = require("./package.json");

gulp.task("packager-win", (done) => {
  packager({
    dir: "./",
    out: "./release",
    name: config.name,
    arch: "x64",
    platform: "win32",
    electronVersion: "7.1.1",
    overwrite: true,
    asar: true,
    appVersion: config.version,
    appCopyright: "",
    icon: "./resources/image/dr.ico"
  });
  done();
});

gulp.task('packager-mac', (done) => {
  packager({
    dir: './',
    out: './release',
    name: config.name,
    arch: 'x64',
    platform: 'darwin',
    electronVersion: '2.0.9',
    overwrite: true,
    asar: true,
    appVersion: config.version,
    appCopyright: '',
  });
  done();
});
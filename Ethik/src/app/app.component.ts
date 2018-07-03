import { Component, OnInit, ViewChild } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import yolo, { downloadModel } from 'tfjs-yolo-tiny';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('videoElement') videoElement: any;
  @ViewChild('canvasElement') canvasElement: any;
  video: any;
  canvas: any;
  
  model: tf.Model;

  ngOnInit() {
    this.loadModel();
	this.video = this.videoElement.nativeElement;
	this.canvas = this.canvasElement.nativeElement;
	this.initCamera();
  }

  async loadModel() {
    this.model = await tf.loadModel('assets/model2.json');
  }
  
  initCamera(){
	  var browser = <any>navigator;
	  browser.getUserMedia = (browser.getUserMedia || browser.webkitGetUserMedia ||
	  browser.mozGetUserMedia || browser.msGetUserMedia);
	  
	  browser.mediaDevices.getUserMedia({video: { width: 416, height: 416 }, audio: false}).then(stream => {
		 this.video.src = window.URL.createObjectURL(stream);
		 this.video.play();
	  });
  }
  
  pause() {
	  this.video.pause();
  }
  
  resume() {
	  this.video.play();
  }
  
  async takePhoto() {
	this.canvas.width = 416;
	this.canvas.height = 416;
	
	var context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, 416, 416);
	console.log(context);
	
	let image = tf.fromPixels(this.canvas, 3);
	
	let newimage = image.reshape([1, 416, 416, 3]);
	let newimage2 = tf.cast(newimage, 'float32');
	console.log(newimage2);
	
	const boxes = await yolo(newimage2, this.model);
	console.log(boxes);
	
	context = this.canvas.getContext('2d');
	
	for(var i = 0; i < boxes.length; i++){
		context.rect(boxes[i].left, boxes[i].top, boxes[i].right-boxes[i].left, boxes[i].bottom-boxes[i].top);
	}
	
	context.stroke();
  }
  
}






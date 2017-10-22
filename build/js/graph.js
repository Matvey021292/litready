//VARS
var canvas,ctx,cw,ch,grid={},now, line={}, cellw, quotes, timer={}, bt_grn, bt_red, vid_grad, tickspd, qbtns;

function init() {
	canvas = document.getElementById('cgraph');
	ctx = canvas.getContext('2d');
	bt_grn = document.getElementsByClassName('btn__green')[0];
	bt_red =  document.getElementsByClassName('btn__red')[0];
	vid_grad = document.getElementsByClassName('vidget__gradient')[0];
	$("#restart_button a").on("click",function(){
		$("#vidget_results").fadeOut(400);
		bt_grn.parentNode.style.display="block";	
		vid_grad.style.display="block";	
		/* bt_grn.style.opacity=1;
		bt_grn.style.display="block";
		bt_red.style.opacity=1;
		bt_red.style.display="block"; */
		});
	qbtns = [];
	qbtns[0]=document.getElementsByClassName('vidget__list')[0].childNodes[1];
	qbtns[1]=document.getElementsByClassName('vidget__list')[0].childNodes[3];
	qbtns[2]=document.getElementsByClassName('vidget__list')[0].childNodes[5];
	qbtns[3]=document.getElementsByClassName('vidget__list')[0].childNodes[7];
	window.addEventListener('resize', onresize);
	bt_grn.onclick = function() {btn_click(0)};
	bt_red.onclick = function() {btn_click(1)};	
	qbtns[0].onclick = function(){set_instrument(0)};
	qbtns[1].onclick = function(){set_instrument(1)};
	qbtns[2].onclick = function(){set_instrument(2)};
	qbtns[3].onclick = function(){set_instrument(3)};
	tickspd=0.5;
	line.points=[0];
	line.last=line.points[0];
	line.t=1;  //timer for chart line
	line.val=1;	//random multiplyer
	line.mx=1;  //last point anim timer
	line.max=40/tickspd; //points limiter
	line.fix=999; // Y-pos of user fixed line
	line.fix_anim=0;
	line.dr=0;   //radnom displacement
	line.color=[220,220,220];
	line.pnt_color=[20,220,20];
	line.fix_color=[160,0,0];
	quotes = [1.06535,1224.50,128.82,52.23];
	quotes.current = 0;
	grid.ccount_w=8;
	grid.ccount_h=4;
	grid.dx=0;
	
	now = Date.now();
	timer.t=15;
	timer.visible=false;
	line.now = Date.now();
	onresize();
	start();
}

function start() {
	
	line.anim=TweenLite.from(line,tickspd,{t:0,onComplete:function(){
		
		line.push_point(line.val);
		line.anim.restart();
		
		}});
	
	loop();
	
}

function set_instrument(i) {
	if(line.fix==999){
		now = Date.now();
		quotes.current=i;
		line.points=[(Math.random()*ch-ch/2)*0.8];
	}
}

function btn_click (num) {
	line.val=1;
	
	if (num==0) {
		line.dr = 5;
		TweenLite.to(line,4,{val:1,dr:-15,delay:8});
		}else {
		line.dr = -5;
		TweenLite.to(line,4,{val:1,dr:15,delay:8});
		}
	$(".vidget__gradient, .vidget__graph-buttons").fadeOut(400);
	//vid_grad.style.display="none";	
	//bt_grn.parentNode.style.display="none";	
	/* bt_grn.style.opacity=0;
	bt_grn.style.display="none";
	bt_red.style.opacity=0;
	bt_red.style.display="none"; */
	line.max=300;
	line.fix = line.last;
	timer.x=(line.points.length-2); 
	timer.visible=true;
	
	TweenLite.to(line,1,{fix_anim:1});
	TweenLite.to(timer,15,{t:0,ease:Power0.easeIn, onComplete:function(){
		//line.anim.kill();
		$("#vidget_results").fadeIn(400);		
		
		//TODO restart
		restart();
		
	}});
	
	//alert(num);
	
}

function restart() {
	line.points=[0];
	line.last=line.points[0];
	line.t=1;  //timer for chart line
	line.val=1;	//random multiplyer
	line.mx=1;  //last point anim timer
	line.max=40/tickspd; //points limiter
	line.fix=999; // Y-pos of user fixed line
	line.fix_anim=0;
	line.dr=0;   //radnom displacement
	grid.dx=0;
	timer.t=15;
	timer.visible=false;
}

function onresize() {
		cw=canvas.offsetWidth;//canvas.width;
		ch=canvas.offsetHeight;//canvas.height;
		canvas.width=cw;
		canvas.height=ch;
		console.log(cw,ch);
		cellw=Math.floor(cw/(grid.ccount_w+0.5));
	};
	
function drawLine(ctx) {
	
	ctx.save();
	var sx = 0.7*cellw;
	ctx.translate(Math.floor(sx),cellw*2);
	ctx.strokeStyle="rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",1)";
	//main graph
	ctx.beginPath();  
	for (var i = 0;i<line.points.length-1;i++) {
		
		if (i*cellw/10*tickspd-grid.dx>=0) {			
			ctx.lineTo(i*cellw/10*tickspd-grid.dx,line.points[i]);
			//if (line.points[i]>line.points[i-1]) ctx.strokeStyle="rgba(0,255,0,1)"; else ctx.strokeStyle="rgba(255,0,0,1)";						
		}
	}
	
	//last line
	var x,y;
	x=(i-1+line.mx)*cellw/10*tickspd-grid.dx;
	y=line.last;
	ctx.lineTo(x,y);
	//i--;
	
	//graph gradient
	ctx.stroke();
	
		ctx.lineTo(x,ch/2);
		ctx.lineTo(0,ch/2);
		ctx.closePath();
		
		var grd = ctx.createLinearGradient(0,-ch/2,0,ch/2);
		grd.addColorStop(0,"rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",0.2)");
		grd.addColorStop(1,"rgba("+line.color[0]+","+line.color[1]+","+line.color[2]+",0)");
		
		ctx.fillStyle=grd;
		ctx.fill();
	
	//	last point 
		ctx.beginPath();
		ctx.arc(x,y,10,0,2*Math.PI);		
		var grd2 = ctx.createRadialGradient(x,y,2,x,y,10);
		grd2.addColorStop(0,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.pnt_color[0]+","+line.pnt_color[1]+","+line.pnt_color[2]+",0)");
		ctx.fillStyle=grd2;
		
	ctx.fill();
	
	//draw line with current quote
	
	
	ctx.beginPath();
	
	ctx.lineTo(0,y);
	ctx.lineTo(-sx*0.1,y-ch*0.03);
	ctx.lineTo(-sx+1,y-ch*0.03);
	ctx.lineTo(-sx+1,y+ch*0.03);
	ctx.lineTo(-sx*0.1,y+ch*0.03);
	ctx.lineTo(0,y);
	ctx.lineTo(cw,y);
	
	var grd = ctx.createLinearGradient(-sx,0,cw,0);
	grd.addColorStop(0,"rgba(200,200,200,1)");
	grd.addColorStop(0.077,"rgba(200,200,200,1)");
	grd.addColorStop(0.077,"rgba(250,250,250,0.4)");
	grd.addColorStop(0.6,"rgba(250,250,250,0.4)");
	grd.addColorStop(0.8,"rgba(250,250,250,0)");
	grd.addColorStop(1,"rgba(250,250,250,0)");
	ctx.strokeStyle=grd;
	
	ctx.fillStyle = "rgba(30,30,30,1)";
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle = "rgba(255,255,255,1)";
	//TODO rounding
	var txt = (quotes[quotes.current]*(1-0.000016*y)).toString().slice(0,7);
	ctx.font="7pt Arial";
	ctx.textBaseline="middle"; 
	ctx.textAlign="center"; 
	ctx.fillText(txt,-sx/2,y);
	
	//line fix
	if (line.fix!=999){
		
		var tx1 = timer.x*tickspd*cellw/10;
		var tx2 = (timer.x*tickspd+15)*cellw/10-tx1;
		ctx.moveTo(tx1,line.fix);
		ctx.beginPath();
		

		var n = 20;
		for (var i=0;i<n;i+=2){
			ctx.moveTo(tx1+tx2*i/n,line.fix);
			ctx.lineTo(tx1+tx2*(i+1)/n,line.fix);
		}

		var grd = ctx.createLinearGradient(tx1,0,tx1+tx2,0);
			grd.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
			grd.addColorStop(line.fix_anim,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
			grd.addColorStop(line.fix_anim,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
			grd.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		
		ctx.strokeStyle=grd;				
		ctx.stroke();
		
		//point1
		ctx.beginPath();
		ctx.arc(tx1,line.fix,8,0,2*Math.PI);
		
		var grd2 = ctx.createRadialGradient(timer.x*tickspd*cellw/10,line.fix,2,timer.x*tickspd*cellw/10,line.fix,8);
		grd2.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		ctx.fillStyle=grd2;
		
		ctx.fill();
		
		//point2
		ctx.beginPath();
		var r2=line.fix_anim<1?0:1;
		ctx.arc(tx1+tx2,line.fix,8*r2,0,2*Math.PI);
		
		var grd2 = ctx.createRadialGradient(tx1+tx2,line.fix,2,tx1+tx2,line.fix,8);
		grd2.addColorStop(0,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",1)");
		grd2.addColorStop(0.3,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0.2)");
		grd2.addColorStop(1,"rgba("+line.fix_color[0]+","+line.fix_color[1]+","+line.fix_color[2]+",0)");
		ctx.fillStyle=grd2;
		
		ctx.fill();
	}
	
	ctx.restore();
	
}	

function drawGrid(ctx){
	ctx.clearRect(0,0,cw,ch);
	ctx.save();
	
	ctx.fillStyle="rgba(40,40,40,0.2)";
	//ctx.fillRect(0,0,cw,ch);
	ctx.strokeStyle="rgba(100,100,100,0.5)";
	ctx.fillStyle="rgba(100,100,100,1)";
	ctx.font="7.5pt Arial";
	//var cellw=Math.floor(cw/(grid.ccount_w+0.5));
	ctx.translate(Math.floor(0.7*cellw),0);
	//ctx.strokeRect(0.5,0.5,cw,grid.ccount_h*cellw);
	//big grid	
	
	ctx.beginPath();
	for (var i=0;i<grid.ccount_w+4;i++) {	//vert lines
		if (Math.floor(i*cellw-grid.dx)>=0) {
			ctx.moveTo(Math.floor(i*cellw-grid.dx)+0.5,0);
			ctx.lineTo(Math.floor(i*cellw-grid.dx)+0.5,(grid.ccount_h+0.15)*cellw);
			
			if (i%3==0) {
				var tmp_now=new Date(now);
				//var sec = now.getSeconds()+1;
				tmp_now.setSeconds(tmp_now.getSeconds()+30*i/3);
				ctx.fillText(tmp_now.toLocaleTimeString('en-GB'),Math.floor(i*cellw-grid.dx)+cellw*.05,ch*0.99);
				}
		}
	}
	ctx.moveTo(0,0);
	ctx.font="7.5pt Arial";
	ctx.textBaseline="top"; 
	for (var i=0;i<grid.ccount_h+1;i++) {	//horz lines
	ctx.moveTo(-cellw*0.15,Math.floor(i*cellw)+0.5);
	ctx.lineTo(cw,Math.floor(i*cellw)+0.5);
	//TODO rounding to 6 digits
	var txt = (quotes[quotes.current]*(1+0.001*(2-i))).toString().slice(0,7);
	ctx.fillText(txt,-cellw*0.7,Math.floor(i*cellw));
	}
	ctx.closePath();
	
	var grd = ctx.createLinearGradient(0,0,cw,0);
	grd.addColorStop(0,"rgba(100,100,100,0.5)");
	grd.addColorStop(0.6,"rgba(100,100,100,0.5)");
	grd.addColorStop(0.75,"rgba(100,100,100,0)");
	grd.addColorStop(1,"rgba(100,100,100,0)");
	ctx.strokeStyle=grd;
	//ctx.strokeStyle="rgba(100,100,100,0.5)";
	ctx.stroke();
	
	//small grid
	ctx.moveTo(0,0);
	ctx.beginPath();
	for (var i=0;i<(grid.ccount_w+3)*4+1;i++) {	//vert lines
		if (Math.floor(i*cellw/4-grid.dx)>=0) {
			ctx.moveTo(Math.floor(i*cellw/4-grid.dx)+0.5,0);
			ctx.lineTo(Math.floor(i*cellw/4-grid.dx)+0.5,grid.ccount_h*cellw);
		}
	}
	ctx.moveTo(0,0);
	for (var i=0;i<grid.ccount_h*4+1;i++) {	//horz lines
	ctx.moveTo(0,Math.floor(i*cellw/4)+0.5);
	ctx.lineTo(cw,Math.floor(i*cellw/4)+0.5);
	}
	ctx.closePath();
	
	var grd = ctx.createLinearGradient(0,0,cw,0);
	grd.addColorStop(0,"rgba(100,100,100,0.1)");
	grd.addColorStop(0.6,"rgba(100,100,100,0.1)");
	grd.addColorStop(0.85,"rgba(100,100,100,0)");
	grd.addColorStop(1,"rgba(100,100,100,0)");
	ctx.strokeStyle=grd;
	//ctx.strokeStyle="rgba(100,100,100,0.1)";
	ctx.stroke();
	
	//TIMER
	if (timer.visible) {
	ctx.beginPath();
	
	var tx = Math.round((timer.x*tickspd+15)*cellw/10-grid.dx)+0.5;
	ctx.moveTo(tx,0);
	var n = 40;
	for (var i=0;i<n;i+=2){
			ctx.moveTo(tx,(grid.ccount_h)*cellw*i/n);
			ctx.lineTo(tx,(grid.ccount_h)*cellw*(i+1)/n);
		}
	
	//ctx.lineTo(tx,(grid.ccount_h)*cellw);
	ctx.strokeStyle="rgba(255,255,255,1)";
	ctx.stroke();
	
	var t = timer.t>=9?Math.ceil(timer.t):"0"+Math.ceil(timer.t);	
	ctx.font="10pt HelveticaNeueCyr";
	ctx.textBaseline="top"; 
	ctx.textAlign="center"; 
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillText("ДО ЗАКРЫТИЯ",tx+cw*0.1,2);
	ctx.fillText("СДЕЛКИ:",tx+cw*0.1,ch*0.07);
	ctx.font="Bold 15pt HelveticaNeueCyr";
	if (timer.t<=5) ctx.fillStyle = "rgba(200,0,0,1)"; 
		else ctx.fillStyle = "rgba(255,255,255,1)";
	
	ctx.fillText("00:"+t,tx+cw*0.1,ch*0.15);
	
	//timer start line
	ctx.beginPath();
	tx = Math.round((timer.x*tickspd)*cellw/10-grid.dx)+0.5;
	ctx.moveTo(tx,0);
	var n = 40;
	for (var i=0;i<n;i+=2){
			ctx.moveTo(tx,(grid.ccount_h)*cellw*i/n);
			ctx.lineTo(tx,(grid.ccount_h)*cellw*(i+1)/n);
		}
	//ctx.lineTo(tx,(grid.ccount_h)*cellw);
	ctx.strokeStyle="rgba(255,255,255,1)";
	ctx.stroke();
	}
	
	
	
	ctx.restore();
}


function loop() {
	/* var now2 = Date.now();
	if ((now2-line.now)/1000>=1) {
		line.now=now2;
		line.push_point();
	} */
	
	
	drawGrid(ctx);
	drawLine(ctx);

	window.requestAnimFrame(loop);
}

line.push_point = function (val) {
	if (line.points.length>=line.max && grid.dx==0) {
		
		grid.anim = TweenLite.to(grid,1,{dx:cw*0.35,ease:Power0.easeInOut,onComplete:function(){
			grid.dx=0;
			//now=Date.now();
			line.points.splice(0,30/tickspd);
		}});
		
	}
	if (!val) val=1;
	
	var p = line.points[line.points.length-1]+(Math.random()*50-25)*val+line.dr;
	//console.log(line.fix);
	while ((p>line.fix+80 || p<line.fix-80)&&line.dr!=0) {
		//p = line.points[line.points.length-1]+(Math.random()*50-25)*val+line.dr;
		//p =line.fix+(Math.random()*30-15);
		p= line.points[line.points.length-1];
		console.log(p);
		}

	line.last = p;
	if (Math.abs(p)<ch*0.4)	{		
		TweenLite.from(line,tickspd,{mx:0,last:line.points[line.points.length-1],ease:Power1.easeIn});
		line.points.push(p); 
	}
		else line.push_point(val);
}

window.requestAnimFrame = function () {
					return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
						window.setTimeout(a, 1E3 / 30)
					}
				}();
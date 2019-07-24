var audio = {
	'hid': document.getElementById('hid'),
	'oWay': document.getElementById('way'),
	'oShow': document.getElementById('show'),
	'big': document.getElementById('big'), //no
	'mp3': document.getElementById('aud'),
	'song': document.getElementById('song'),
	'singer': document.getElementById('singer'),
	'control': document.getElementById('control'), //no
	'cur': document.getElementById('cur'), //当前播放时间
	'dur': document.getElementById('dur'), //播放总时长
	'sound': document.getElementById('sound'),
	'oP': this.sound.getElementsByTagName("p"),
	'playc': document.getElementById('play'),
	'point': document.getElementById('point'), //播放进度点
	'line': document.getElementById('line'), //播放进度条
	'spoint': document.getElementById('spoint'), //声音进度点
	'sline': document.getElementById('sline'), //声音进度条
	'smuted': document.getElementById('muted'), //静音按钮

	'oSou': this.sound.getElementsByTagName("div"),

	'oList': document.getElementById('list'),
	'off': {
		s: 1,
		p: 1,
		w: 1,
		n: 1,
		f: 0,
		vol: 1
	}, //s:0播放暂停，s:1播放   n:0顺序播放,n:1随机,n:2单曲	f:播放方式 f:1可见 f:0不可见
	'step': 0, //播放的歌曲序号
	// 初始化 
	'init': function() {
		var oUl = this.oList.children[0];
		// 获取songData歌曲添加列表
		for(var i = 0; i < songDate.length; i++) {
			var oLi = document.createElement('li');
			oLi.draggable = 'true';
			oLi.innerHTML = '<p class="song">' + songDate[i].song + '</p><p class="star">' + songDate[i].singer + '</p>';
			oUl.appendChild(oLi);
		}

		this.changeText(audio.step);
		this.play();
		this.controlPlay(audio.point, audio.line, audio.mp3); //调整播放进度
		this.controlSound(audio.spoint, audio.sline, audio.mp3); //调整播放进度
		this.muted(); //静音
		this.autoPlay();
		this.nextPlay();
		this.clickPlay();
		this.playWay();
		this.toggle();		
//		this.drag();

	},

	// 歌曲拖拽
//	'drag': function() {
//		var This = this;
//		var oLi = this.oList.getElementsByTagName("li");
//		! function changeAlign() { //+function !function === (function(){})()
//			var start;
//			for(var i = 0; i < oLi.length; i++) {
//				oLi[i].index = i;
//				oLi[i].ondragstart = function() {
//					start = this.index;
//					console.log("start:" + start);
//				}
//				oLi[i].ondragover = function(ev) {
//					ev = ev || window.event;
//					ev.preventDefault();
//					// console.log(this.index);
//					for(var i = 0; i < oLi.length; i++) {
//						this.style.border = "none";
//					}
//					if(this.index != start) {
//						this.style.borderBottom = "1px solid #f00"
//					}
//				}
//				oLi[i].ondrop = function(ev) {
//					ev = ev || window.event;
//					ev.preventDefault();
//					console.log("ondrop:" + this.index);
//					var newArr = arrCopy(songDate);
//					if(this.index == oLi.length) { //最后添加
//						appendAfter(oLi[start], this);
//						songDate.splice(start, 1);
//						songDate.splice(this.index, 0, newArr[start]);
//					} else if(this.index == 0) { //最前添加
//
//					} else if(start > this.index) {
//
//					}
//					this.style.border = "none";
//					changeAlign();
//				}
//
//			}
//		}();
//		// 复制数组
//		function arrCopy(arr) {
//			var newArr = new Array();
//			for(var i = 0; i < arr.length; i++) {
//				newArr[i] = arr[i];
//			}
//			return newArr;
//		}
//		// 在obj后面添加元素
//		function appendAfter(newNode, targetNode) {
//			var oP = targetNode.parentNode;
//			if(oP.lastChild == targetNode) {
//				oP.appendChild(newNode);
//			} else {
//				oP.insertBefore(newNode, targetNode.nextSibling);
//			}
//		}
//	},

	//点击播放方式
	'toggle': function() {
		var This = this;
		this.oWay.onclick = function() {
			if(This.off.f) {
				This.hid.style.display = "none";
				This.off.f = 0;
			} else {
				This.hid.style.display = "block";
				This.off.f = 1;
			}
		}
	},

	// 列表播放
	'clickPlay': function() {
		var This = this;
		var oLi = this.oList.getElementsByTagName("li");
		for(var i = 0; i < oLi.length; i++) {
			oLi[i].index = i;
			oLi[i].ondblclick = function(ev) {
				ev = ev || window.event;
				ev.cancelBubble = true;
				This.step = this.index;
				clearInterval(This.mp3.timer);
				This.changeText(This.step);
				This.playc.style.backgroundPosition = "-151px -53px";
			}
		}
	},

	// 上一曲，下一曲
	'nextPlay': function() {
		var This = this;
		// 点击事件上一曲
		this.oP[0].onclick = function(ev) {
			ev = ev || window.event;
			ev.preventDefault();
			This.step--;
			if(This.step < 0) {
				This.step = songDate.length - 1;
			}
			setTime();
		}
		// 点击事件下一曲
		this.oP[2].onclick = function(ev) {
			ev = ev || window.event;
			ev.preventDefault();
			This.step++;
			if(This.step >= songDate.length) {
				This.step = 0;
			}
			setTime();
		}

		function setTime() {
			clearInterval(This.mp3.timer);
			This.point.style.left = "0px";
			This.cur.innerHTML = "00:00";
			This.dur.innerHTML = "00:00";
			This.changeText(This.step);
		}
	},

	// 播放、暂停
	'play': function() {
		var This = this; //This指audio
		this.playc.onclick = function(ev) {
			//this指按钮
			ev = ev || window.event;
			ev.preventDefault();
			if(This.off.s) { //播放->暂停
				this.style.backgroundPosition = "-85px -54px";
				This.mp3.pause();
				clearInterval(This.mp3.timer);
				This.off.s = 0;
			} else { //暂停->播放
				this.style.backgroundPosition = "-151px -53px";
				This.mp3.play();
				This.mp3.timer = setInterval(This.changeTime, 1000);
				This.off.s = 1;
			}
		}
	},

	//调整播放进度
	'controlPlay': function(obj, lineC, vid) {
		var This = this;
		obj.onmousedown = function(ev) { //obj == point 
			ev = ev || window.event;
			ev.preventDefault();
			var oLineleft = ev.clientX - obj.offsetLeft;
			document.onmousemove = function(ev) {
				ev = ev || window.event;
				ev.preventDefault();
				var xC = ev.clientX;
				var x = xC - oLineleft;
				if(x < 0) {
					x = 0;
				} else if(x < lineC.offsetWidth) {
					x = xC - oLineleft;
				} else if(x >= lineC.offsetWidth) {
					x = lineC.offsetWidth;
				}
				obj.style.left = x + 'px';
				var num = x / (lineC.offsetWidth - obj.offsetWidth);
				vid.currentTime = num * vid.duration;
				This.changeTime();
			}
			document.onmouseup = function() {
				this.onmousemove = null;
				this.onmouseup = null;
			}
		}
	},

	// 调整播放声音大小
	'controlSound': function(tar, lineC, vid) {
		var This = this;
		tar.onmousedown = function(ev) {
			ev = ev || window.event;
			ev.preventDefault();
			var sLineleft = ev.clientX - tar.offsetLeft;
			document.onmousemove = function(ev) {
				ev = ev || window.event;
				ev.preventDefault();
				var xC = ev.clientX;
				var x = xC - sLineleft;
				if(x < 0) {
					x = 0;
				} else if(x < lineC.offsetWidth) {
					x = xC - sLineleft;
				} else if(x >= lineC.offsetWidth) {
					x = lineC.offsetWidth;
				}
				tar.style.left = x + 'px';
				var num = x / lineC.offsetWidth;
				vid.volume = num;
				This.off.vol = num;
			}
			document.onmouseup = function() {
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
	},

	// 歌词联动，初始化显示
	'changeText': function(step) {
		this.mp3.src = songDate[step].mp3Src;
		this.song.innerHTML = songDate[step].song;
		this.singer.innerHTML = songDate[step].singer;
		var g = songDate[step].txt.split('[');
		var str = '';
		for(var i = 0; i < g.length; i++) {
			var arr = g[i].split(']');
			var tArr = arr[0].split('.');
			var t = tArr[0].split(':');
			var time = t[0] * 60 + parseInt(t[1]);
			var gc = arr[1];
			if(gc) {
				str += '<p id="s' + time + '">' + gc + '</p>';
			}
		}
		this.oShow.innerHTML = str;
		// 歌词联动
		var oP = this.oShow.getElementsByTagName('p');

		//timeupdate  当歌曲时间发生变化时  触发后面功能
		this.mp3.addEventListener("timeupdate", function() {
			var time = parseInt(this.currentTime); //获取当前播放时间
			if(document.getElementById("s" + time)) {
				// 歌词添加
				for(var i = 0; i < oP.length; i++) {
					oP[i].style.color = '#fff';
					if(oP[i].id == 's' + time) {
						oP[i].style.color = '#f00';
					}
				}
				// 歌词滚动
				for(var i = 0; i < time; i++) {
					audio.oShow.style.marginTop = -(time * 2) + 'px';
				}
			}
		});
		this.mp3.timer = setInterval(this.changeTime, 1000);
	},

	// 静音  静音后恢复之前的默认值
	'muted': function() {
		var This = this;
		this.smuted.onclick = function() {
			var left = This.spoint.offsetLeft;
			if(This.off.p) {
				this.style.backgroundPosition = "-249px -5px";
				This.mp3.muted = true;
				This.spoint.style.left = '0px';
				This.off.p = 0;
			} else {
				this.style.backgroundPosition = "-218px -5px";
				This.mp3.muted = false;
				This.spoint.style.left = This.off.vol * This.sline.offsetWidth + 'px'; //恢复到原来值
				This.off.p = 1;
			}
		}
	},

	// 自动播放 控制播放循环方式
	'autoPlay': function() {
		// console.log("first:"+this.step);
		var This = this;
		var nextStep = this.step;
		this.mp3.timer = setInterval(This.changeTime, 1000);
		// 监听歌曲结束
		audio.mp3.addEventListener("ended", function() {
			clearInterval(This.mp3.timer);
			This.point.style.left = "0px";
			This.cur.innerHTML = "00:00";
			This.dur.innerHTML = "00:00";
			// 判断下一曲播放方式
			switch(This.off.n) {
				//顺序播放
				case 0:
					This.step++;
					if(This.step >= songDate.length)
						This.step = 0;
					This.changeText(This.step);
					break;
					//随机播放
				case 1:
					This.changeText(random());
					break;
					//单曲播放
				case 2:
					This.step = nextStep;
					This.changeText(nextStep);
					break;
			}
			// console.log("next:"+This.step);
		});
		// This.autoPlay();
		function random() {
			var step = Math.floor(Math.random() * songDate.length);
			while(step == nextStep) {
				step = Math.floor(Math.random() * songDate.length);
			}
			This.step = step;
			return step;
		}
	},

	// 返回播放方式
	'playWay': function() {
		var This = this;
		var hidList = this.hid.children;
		for(var i = 0; i < hidList.length; i++) {
			hidList[i].index = i;
			hidList[i].onclick = function() {
				This.oWay.innerHTML = this.innerHTML;
				This.off.n = this.index;
				This.off.f = 0;
				This.hid.style.display = "none";
			}
		}
		return This.off.n;
	},

	// 联动歌曲时间和播放进度
	'changeTime': function() {
		this.dur.innerHTML = audio.getTime(audio.mp3.duration);
		this.cur.innerHTML = audio.getTime(audio.mp3.currentTime);
		var n = audio.mp3.currentTime / audio.mp3.duration;
		audio.point.style.left = Math.floor(n * (audio.line.offsetWidth)) + 'px';
	},

	//返回00:00的时间格式
	'getTime': function(time) {
		time = parseInt(time);
		var hour = this.addzero(Math.floor(time / 3600));
		var minute = this.addzero(Math.floor(time % 3600 / 60));
		var second = this.addzero(Math.floor(time % 60));
		return minute + ':' + second;
	},

	// 补零
	'addzero': function(a) {
		if(a < 10) {
			return '0' + a;
		} else {
			return a + '';
		}
	}
}
/*-----
	版本号V5.1.0.26
	版本命名规范：V版本号.不兼容更新.普通更新.更新次数
	该接口库负责中间件主体功能和通用接口功能
	示例：
	UTCMiddleWare.GetVersion({success:function(version){},fail:function(msg){},error:function(msg){}});
-----*/
//主体
function UTCMiddleWare_Function(){
	var self=this;
	self.code='P6kjUIL6RkdLb5Edwa7jNDozQFPAkkFO93nk3MIaZSgxsrDkkUKa+aBZPMtssutsbRXunj2vSh1sV9PsLMRHn0oKxGOAkfb7ab/TsXbKm7dzY44atQpMoxCyBKndvlj60pyEI/2l5cOft2GSbsgl/CihbzUPs7nJ6MmnoyUGJNI=';
	self.version='';
	self.isloading=true;
	self.loadingflag=null;
	self.usekey=false;
	self.vnum=null;
	self.initsure=true;
	self.errorstate={
		//通用
		0x07000000:'（第三方错误/系统错误)',
		0x07000001:'请先启动电子钥匙辅助控件',
		0x07000002:'电子钥匙辅助控件请求超时',
		0x07000003:'电子钥匙辅助控件拒绝访问',
		0x07000004:'缺少参数或参数格式错误',
		0x07000005:'没有找到指定挂载的接口库',
		0x07000006:'json格式错误无法解析',
		0x07000007:'无法连接外部服务',
		0x07000008:'外部服务请求超时',
		0x07000009:'外部服务拒绝访问',
		0x07000010:'取消选择印章',
		0x0700000A:'钥匙中缺少印章信息',
		0x0700000B:'钥匙中缺少签字信息',
		0x0700000C:'电子钥匙密码错误'
	};
	
	self.AddPlugin=function(json){};
	//成功回调
	self.successcallback=function(json,data){
		if(typeof(json.success)=='function'||typeof(json.finish)=='function'){
			json.success(data);
		}else{
			alert(data);
		};
	};
	//错误回调
	self.errorcallback=function(json,state,code,data){
		if(state=='fail'){
			debugger;
			if(typeof(json.fail)=='function'||typeof(json.finish)=='function'){
				json.fail(code,data);
			};
		};
		if(state=='error'){
			debugger;
			if(typeof(json.error)=='function'||typeof(json.finish)=='function'){
				json.error(code,data);
			};
		};
	};
	//请求
	self.LocalAjaxPost=function(json,callback){
		try{
			eval("json = '"+JSON.stringify(json)+"';");
			var url = 'http://127.0.0.1:58902/UTCDaemon/';
			if(document.location.protocol=='https:'){
				url = 'https://daemon.utcsoft.com:58912/UTCDaemon/';
			};
			function postfn(){
				var request;
				if(window.ActiveXObject&&self.vnum<9){
					request =new ActiveXObject('Microsoft.XMLHttp'); 
				}else{
					request =new XMLHttpRequest();
				};
				request.open('POST', url,true);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				request.onreadystatechange= function(){
					if(request.readyState == 4) {
						if(request.status == 200) {
							var obj = JSON.parse(request.responseText);
							if(obj.code=='0'){
								callback('success',obj.code,obj.result);
							}else{
								callback('fail',obj.code,obj.errormsg);
							};
						}else{
							callback('fail','0x07000001',self.errorstate[0x07000001]);
						};
					};
				};
				json=json.replace(/\\/ig,"\\\\"); 
				//eval("json = '"+json+"';");
				request.send('json=' + json);
			};
			if(navigator.userAgent.indexOf('Trident/')>=0){
				var shitie;
				if(window.ActiveXObject&&self.vnum<9){
					shitie = new ActiveXObject('Microsoft.XMLHttp'); 
				}else{
					shitie = new XMLHttpRequest();
				};
				shitie.open('Get', url,true);
				shitie.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				shitie.onreadystatechange= function(){
					if(shitie.readyState == 4) {
						postfn();
					};
				};
				shitie.send();
			}else{
				postfn();
			};
		}catch(e){
			callback('fail','0x07000001',self.errorstate[0x07000001]);
		};
	};
	//外部请求
	self.WebAjaxPost=function(json,callback){
		try{
			var url=json.url;
			var request = new XMLHttpRequest();
			request.open('POST', url,true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
			request.onreadystatechange= function(){
				if(request.readyState == 4) {
					if(request.status == 200) {
						var obj = JSON.parse(request.responseText);
						callback('success',obj);
					}else{
						callback('fail','0x07000007',self.errorstate[0x07000007]);
					};
				};
			};
			json = (function(obj){ // 转成post需要的字符串.
			    var str = "";
			    for(var prop in obj){
			        str += prop + "=" + obj[prop] + "&"
			    };
			    str=str.substring(0,str.length-1);
			    return str;
			})(json);
			request.send(json);
		}catch(e){
			//console.log(e.message);
			callback('fail','0x07000007',self.errorstate[0x07000007]);
		};
	};
	self.Initialize=function(json){
		if(self.initsure){
			self.initsure=false;
			self.tool=new UTCMiddleWare_Tool();
			self.daemon=new UTCMiddleWare_Daemon();
			self.Ui=new UTCMiddleWare_Ui();
			if(self.tool.Ie7()){
				alert('请使用IE8及以上内核的浏览器或非IE内核浏览器');
			};
			self.ApiInit();
		};
		try{json.success();}catch(e){};
	};
};
//接口库
/*-----
可调用接口：
	初始化
	获取钥匙信息
	获取证书信息
	获取授权信息
	获取文件路径
	删除文件
	检测钥匙Pin码
	数字签名
	验证数字签名
	数据加密
	电子签章
	读取身份证
	生成签章数据
	按坐标本地签章
	按关键字本地签章
-----*/
function UTCMiddleWare_Api(){
	var s=null;
	var _s=this;
	//缺省界面
	_s.iscert=function(dn,json,callback){
		if(typeof(dn)=='undefined'){
			_s.GetCertInfo({
				ui:true,
				type:'ie',
				success:function(cert){
					callback(cert.DN);
				},
				fail:function(msg,code){
					s.errorcallback(json,'fail',code,msg);
				},
				error:function(msg,code){
					s.errorcallback(json,'error',code,msg);
				}
			});
		}else{
			callback(dn);
		};
	};
	_s.ispath=function(path,json,callback){
		if(typeof(path)=='undefined'){
			_s.GetFilePath({
				success:function(path){
					callback(path);
				},
				fail:function(msg,code){
					s.errorcallback(json,'fail',code,msg);
				},
				error:function(msg,code){
					s.errorcallback(json,'error',code,msg);
				}
			});
		}else{
			callback(path);
		};
	};
	_s.ispin=function(pin,json,callback){
		if(typeof(pin)=='undefined'){
			s.Ui.Ui_Pin.show({success:function(pin){
				_s.OpenKey({
					pin:pin,
					success:function(){
						callback(pin);
					},
					fail:function(msg,code){
						s.errorcallback(json,'fail',code,msg);
					},
					error:function(msg,code){
						s.errorcallback(json,'error',code,msg);
					}
				});
			}});
		}else{
			callback(pin);
		};
	};
	_s.isseal=function(seal,pin,json,callback){
		if(typeof(seal)=='undefined'){
			_s.GetSealInfo({
				pin:pin,
				success:function(seals){
					s.Ui.Ui_Seal.show({
						data:seals,
						success:function(seal){
							callback(seal.value);
						},
						fail:function(msg,code){
							s.errorcallback(json,'fail',code,msg);
						}
					});
				},
				fail:function(msg,code){
					s.errorcallback(json,'fail',code,msg);
				}
			});
		}else{
			callback(pin);
		};
	};
	//获取中间件版本号
	_s.GetVersion=function(json){
		s.daemon.PluginVersion(function(state,code,tmp){
			if(state=='success'){
				json.success(tmp);
			};
			s.errorcallback(json,state,code,tmp);
		});
	};
	//获取钥匙信息
	_s.GetKeyInfo=function(json){
		s.GetKeyInfo.prototype.Id(json);
	};
	_s.GetKeyInfo.prototype.Id=function(json){//序列号
		s.daemon.GetAEKeyID(function(state,code,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				switch(json.content){
					case 'id' :
					s.successcallback(json,id);
					break;
					default:
					s.successcallback(json,{id:id});
				};
			};
			s.errorcallback(json,state,code,id);
		});
	};
	
	//获取证书信息
	_s.GetKeyCertInfo=function(json){
		s.GetCertInfo.prototype.All(json);
	};
	_s.GetCertInfo=function(json){
		s.GetCertInfo.prototype.All(json);
	};
	_s.GetCertInfo.prototype.All=function(json){
		json.type='ie';
		if(typeof(json.type)=='undefined'||json.type.indexOf('ie')<0){
			s.daemon.getKeyCert(function(state,code,data){
				if(state=='success'){
					for(var i=0;i<data.length;i++){
						data[i].SubjectDN=data[i].SubjectName;
						data[i].DN=data[i].SubjectName;
						data[i].IssuerDN=data[i].IssuerName;
						data[i].SerialNumber=data[i].SerialNumber;
						data[i].SN=data[i].SerialNumber;
						data[i].Date=data[i].NotBefore.replace('-','/').replace('-','/').replace('T',' ')+'-'+data[i].NotAfter.replace('-','/').replace('-','/').replace('T',' ');
					};
					if(json.ui==false){
						json.success(data);
					}else{
						s.Ui.Ui_Cert.show({data:data,success:function(cert){
							json.success(cert);
						}});
					};
				};
				s.errorcallback(json,state,code,data);
			});
		}else{
			s.daemon.GetLocalCert(function(state,code,data){
				if(state=='success'){
					var certay=data.split('||');
					var certjn={};
					certjn.SubjectDN=certay[0];
					certjn.DN=certay[0];
					certjn.SerialNumber=certay[1];
					certjn.SN=certay[1];
					certjn.Date=certay[2];
					json.success(certjn);
				};
				s.errorcallback(json,state,code,data);
			});
		};
	};
	
	//获取文件路径
	_s.GetFilePath=function(json){
		if(typeof(json.suf)=='undefined'){
			json.suf='*';
		};
		document.querySelectorAll('body')[0].style.cursor='no-drop';
		document.querySelectorAll('body')[0].style.pointerEvents='none';
		s.daemon.GetLocalFilePath(json.suf,function(state,code,path){
			document.querySelectorAll('body')[0].style.cursor='auto';
			document.querySelectorAll('body')[0].style.pointerEvents='auto';
			if(state=='success'){
				json.success(path);
			};
			s.errorcallback(json,state,code,path);
		});
	};
	
	//检测钥匙Pin码
	_s.OpenKey=function(json){
		s.OpenKey.prototype.OpenEKey(json);
	};
	_s.OpenKey.prototype.OpenEKey=function(json){
		_s.ispin(json.pin,json,function(pin){
			if(pin==undefined||pin==''){
				s.errorcallback(json,'fail','0x07000004',s.errorstate[0x07000004]);
			}else{
				s.daemon.OpenEKey(pin,function(state,code,data){
					if(state=='success'){
						json.success(pin);
					};
					s.errorcallback(json,state,code,data);
				});
			};
		});
	};
	//修改钥匙Pin码
	_s.ChangePin=function(json){
		s.daemon.ChangePIN(json.oldpin,json.newpin,function(state,code,data){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	//获取印章信息
	_s.GetSealInfo=function(json){
		s.daemon.GetEKeyPic(json.pin,function(state,code,data){
			if(state=='success'){
				if(json.ui==false){
                    for(var i=0;i<data.length;i++){
                        data[i].img='data:image/png;base64,'+data[i].value;
                    };
					json.success(data);
				}else{
					s.Ui.Ui_Seal.show({data:data,success:function(seal){
                        seal.img='data:image/png;base64,'+seal.value;
						json.success(seal);
					},fail:function(code,msg){json.fail(code,msg);}});
				};
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetSealSignInfo=function(json){
		s.daemon.GetEKeyPic(json.pin,function(state,code,data){
			if(state=='success'){
				var seal = new Image();
				var sign = new Image();
				sign.onload = function(){
				if(seal.src==''||seal.src==null||seal.src==undefined){
					s.errorcallback(json,'fail','0x0700000A',s.errorstate[0x0700000A]);
					return false;
				};
				if(sign.src==''||sign.src==null||sign.src==undefined){
					s.errorcallback(json,'fail','0x0700000B',s.errorstate[0x0700000B]);
					return false;
				};
					
					
					//创造一个元素
				var canvas=document.createElement("canvas");
				       var height;
				       var width;
					if(json.dx>=0&&json.dy>=0){
						if(seal.width>=(sign.width+json.dx)&&(sign.height+json.dy)>=seal.height){
							width = seal.width;
							height =sign.height+json.dy;
						}else if(seal.width<(sign.width+json.dx)&&(sign.height+json.dy)<seal.height){
							width = sign.width+json.dx;
							height =seal.height;
						}else if(seal.width<(sign.width+json.dx)&&(sign.height+json.dy)>seal.height){
							width = sign.width+json.dx;
							height =sign.height+json.dy;
						}else if(seal.width>(sign.width+json.dx)&&(sign.height+json.dy)<seal.height){
							width = seal.width;
							height =seal.height;
						}
						
					}else if(json.dx<0&&json.dy>=0){
						if(seal.height>=(sign.height+json.dy)){
							width = seal.width+Math.abs(json.dx)+sign.width;
							height =seal.height;
						}else if(seal.height<sign.height+json.dy){
							width = seal.width+Math.abs(json.dx)+sign.width;
							height =sign.height+json.dy;
						}
						
					}else if(json.dx<0&&json.dy<0){
						if(sign.height>=(seal.height+Math.abs(json.dy))){
							width = sign.width+Math.abs(json.dx)+seal.width;
							height =sign.height;
						}else if(sign.height<(seal.height+Math.abs(json.dy))){
							width = sign.width+Math.abs(json.dx)+seal.width;
							height =seal.height+Math.abs(json.dy);
						}
						
					}else if(json.dx>=0&&json.dy<0){
						if(seal.width>=(sign.width+Math.abs(json.dx))){
							width = seal.width;
							height =seal.height+Math.abs(json.dy)+sign.height;
						}else if(seal.width<(sign.width+Math.abs(json.dx))){
							width = sign.width+Math.abs(json.dx);
							height =seal.height+Math.abs(json.dy)+sign.height;
						}
						
					}
					
					canvas.height=height;
					canvas.width=width;
					
					/*if(json.dx>0&&json.dy>0&&sign.height<(seal.height+json.dx)){
						canvas.height = seal.height+json.dx;
						canvas.width = sign.width+json.dy+seal.width;
					}
					if(json.dx>0&&json.dy<0&&sign.height>(seal.height+json.dx)&&sign.width>(seal.width+json.dy)){
						canvas.height = sign.height;
						canvas.width = sign.width;
					}
					if(json.dx>0&&json.dy<0&&sign.height>(seal.height+json.dx)&&sign.width<(seal.width+json.dy)){
						canvas.height = sign.height;
						canvas.width = seal.width+json.dy;
					}
					if(json.dx<0&&json.dy<0&&sign.height>(seal.height+json.dx)&&sign.width<(seal.width+json.dy)){
						canvas.height = sign.height;
						canvas.width = seal.width+json.dy;
					}
					if(json.dx<0&&json.dy>0&&sign.height>(seal.height+json.dx)&&sign.width<(seal.width+json.dy)){
						canvas.height = sign.height;
						canvas.width = seal.width+json.dy;
					}
					if(json.dx<0&&json.dy>0&&sign.height<(seal.height+json.dx)&&sign.width<(seal.width+json.dy)){
						canvas.height = seal.height+json.dx;
						canvas.width = seal.width+json.dy;
					}*/
					
					
					/*canvas.height = sign.height+Math.abs(json.dx)+seal.height;
					canvas.width = sign.width+Math.abs(json.dy)+seal.width;*/
					//创造一个画布环境
				var cxt = canvas.getContext("2d");
					/*seal.onload = function(){
	   					cxt.drawImage(seal,json.dx,json.dy,seal.width,seal.height);
   					sign.onload = function(){
   						cxt.drawImage(sign,0,0,sign.width,sign.height);
	   						
	   						json.success({img:canvas.toDataURL()});
	   					};
					};*/
					var sealx,sealy,signx,signy;
					if(json.dx<0){
						sealx=Math.abs(json.dx);
						signx=0;
					}else{
						sealx=0;
						signx=Math.abs(json.dx);
					};
					if(json.dy<0){
						sealy=Math.abs(json.dy);
						signy=0;
					}else{
						sealy=0;
						signy=Math.abs(json.dy);
					};
					cxt.drawImage(seal,sealx,sealy,seal.width,seal.height);
					cxt.drawImage(sign,signx,signy,sign.width,sign.height);
					
					
					json.success({img:canvas.toDataURL()});
				};
				seal.onload = function(){
					var signbool=true;
					for (var i=0;i<data.length;i++) {
						if(data[i].id=='12'){
							signbool=false;
							sign.src='data:image/png;base64,'+data[i].value;
							
							break;
						};
					};
					if(signbool){
						s.errorcallback(json,'fail','0x0700000B',s.errorstate[0x0700000B]);
					};
				};
				var sealbool=true;
				for (var i=0;i<data.length;i++) {
					if(data[i].id=='11'){
						sealbool=false;
						seal.src='data:image/png;base64,'+data[i].value;
						break;
   					};
				};
				if(sealbool){
					s.errorcallback(json,'fail','0x0700000A',s.errorstate[0x0700000A]);
				};
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	//数字签名
	_s.Sign=function(json){
		if(json.type=='file'){
			if(json.detach==false){
				s.Sign.prototype.File(json);
			}else{
				if(json.tofile==true){
					s.Sign.prototype.FileDetachToFile(json);
				}else{
					s.Sign.prototype.FileDetach(json);
				};
			};
		}else{
			if(json.many==true){
				s.Sign.prototype.Msg_many(json);
			}else{
				if(json.detach==false){
					s.Sign.prototype.Msg(json);
				}else{
					s.Sign.prototype.MsgDetach(json);
				};
			};
		};
	};
	_s.SignMsgDetach=function(json){
		s.Sign.prototype.MsgDetach(json);
	};
	_s.SignMsg=function(json){
		s.Sign.prototype.Msg(json);
	};
	_s.SignFileDetach=function(json){
		s.Sign.prototype.FileDetach(json);
	};
	_s.SignFile=function(json){
		s.Sign.prototype.File(json);
	};
	_s.Sign.prototype.Msg=function(json){//消息签名
		_s.iscert(json.dn,json,function(dn){
			if(typeof(json.hash)=='undefined'){
				json.hash='1.3.14.3.2.26';
			};
			s.daemon.SignString('',dn,'',json.data,json.hash,json.detach,function(state,code,data){
				if(state=='success'){
					json.success(data);
				};
				s.errorcallback(json,state,code,data);
			});
		});
	};
	_s.Sign.prototype.MsgDetach=function(json){//消息签名分离
		_s.iscert(json.dn,json,function(dn){
			if(typeof(json.hash)=='undefined'){
				json.hash='1.3.14.3.2.26';
			};
			s.daemon.SignStringDetach('',dn,'',json.data,json.hash,json.detach,function(state,code,data){
				if(state=='success'){
					json.success(data);
				};
				s.errorcallback(json,state,code,data);
			});
		});
	};
	
	_s.Sign.prototype.FileDetach=function(json){//分离式文件签名
		_s.ispath(json.path,json,function(path){
			_s.iscert(json.dn,json,function(dn){
				if(typeof(json.hash)=='undefined'){
					json.hash='1.3.14.3.2.26';
				};
				s.daemon.DoSignFile('',dn,path,json.hash,function(state,code,data){
					if(state=='success'){
						json.success(data);
					};
					s.errorcallback(json,state,code,data);
				});
			});
		});
	};
	_s.Sign.prototype.FileDetachToFile=function(json){//分离式文件签名（文件数据）
		s.notdn(json.dn,function(state,dn){
			if(state=='success'){
				s.notpath(json.data,function(state,path){
					if(state=='success'){
						if(typeof(json.hash)=='undefined'){
							json.hash='1.3.14.3.2.26';
						};
						if(typeof(json.suf)=='undefined'){
							json.suf='sig';
						};
						s.daemon.DoSignFile3(dn,path,json.hash,path+'.'+json.suf,function(state,code,data){
							if(state=='success'){
								
								json.success(data);
							};
							s.errorcallback(json,state,code,data);
						});
					};
					s.errorcallback(json,state,path);
				});
			};
			s.errorcallback(json,state,dn);
		});
	};
	_s.Sign.prototype.File=function(json){//非分离式文件签名
		_s.ispath(json.path,json,function(path){
			_s.iscert(json.dn,json,function(dn){
				if(typeof(json.hash)=='undefined'){
					json.hash='1.3.14.3.2.26';
				};
				if(typeof(json.suf)=='undefined'){
					json.suf='sig';
				};
				s.daemon.DoSignFile2('',dn,path,json.hash,path+'.'+json.suf,function(state,code,data){
					if(state=='success'){
						json.success(path+'.'+json.suf);
					};
					s.errorcallback(json,state,code,data);
				});
			});
		});
	};
	_s.Sign.prototype.Msg_many=function(json){
		s.Sign.prototype.Msg_time=0;
		s.Sign.prototype.Msg_data=json.data;
		s.iscert(json.dn,json,function(dn){
			s.Sign.prototype.Msg_loop(json,dn);
		});
	};
	_s.Sign.prototype.Msg_loop=function(json,dn){
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		s.daemon.SignStringDetach('',dn,'',json.data[s.Sign.prototype.Msg_time].hashValue,json.hash,json.detach,function(state,code,data){
			if(state=='success'){
				s.Sign.prototype.Msg_data[s.Sign.prototype.Msg_time].keyString=data;
				s.Sign.prototype.Msg_time++;
				if(s.Sign.prototype.Msg_time>s.Sign.prototype.Msg_data.length-1||s.Sign.prototype.Msg_data.length==0){
					s.Sign.prototype.Msg_finish(json);
				}else{
					s.Sign.prototype.Msg_loop(json,dn);
				};
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.Msg_finish=function(json){
		json.success(s.Sign.prototype.Msg_data);
	};
	_s.Sign.prototype.Msg_time=0;
	_s.Sign.prototype.Msg_data=[];
	//数字签名验签
	_s.SignVerify=function(json){
		if(json.type=='file'){
			s.SignVerify.prototype.FileDetach(json);
		}else{
			if(json.detach==false){
				s.SignVerify.prototype.Msg(json);
			}else{
				s.SignVerify.prototype.MsgDetach(json);
			};
		};
	};
	_s.SignMsgDetachVerify=function(json){
		s.SignVerify.prototype.MsgDetach(json);
	};
	_s.SignMsgVerify=function(json){
		s.SignVerify.prototype.Msg(json);
	};
	_s.SignFileDetachVerify=function(json){
		s.SignVerify.prototype.FileDetach(json);
	};
	_s.SignVerify.prototype.MsgDetach=function(json){//消息验签分离
		var signbool=false;
		if(json.stype=='msg'){
			signbool=true;
		};
		if(typeof(json.certtype)=='undefined'){
			json.certtype='RSA';
		};
		s.daemon.VerifyStringDetach(json.source,json.data,json.certtype,signbool,function(state,code,text){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,text);
		});
	};
	_s.SignVerify.prototype.Msg=function(json){//消息验签
		var signbool=false;
		if(json.stype=='msg'){
			signbool=true;
		};
		if(typeof(json.certtype)=='undefined'){
			json.certtype='RSA';
		};
		s.daemon.VerifyString(json.source,json.data,json.certtype,signbool,function(state,code,text){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,text);
		});
	};
	_s.SignVerify.prototype.FileDetach=function(json){//分离式文件验签
		if(typeof(json.type)=='undefined'){
			json.type='RSA';
		};
		s.daemon.VerifyFileSign(json.data,json.type,json.path,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	//数据加密
	_s.Envelope=function(json){
		if(json.type=='file'){
			s.Envelope.prototype.File(json);
		}else{
			s.Envelope.prototype.Msg(json);
		};
	};
	_s.EnvelopMsg=function(json){
		s.Envelope.prototype.Msg(json);
	};
	_s.EnvelopFile=function(json){
		s.Envelope.prototype.File(json);
	};
	_s.Envelope.prototype.File=function(json){//文件加密
		var certtype;
		var encAlg;
		if(json.basealg=='SM4'){
			certtype='SM2';
			encAlg='1.2.840.113549.3.4';
		}else{
			if(json.basealg=='3DES'){
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			}else{
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			};
		};
		if(typeof(json.suf)=='undefined'){
			json.suf='enc';
		};
		_s.ispath(json.path,json,function(path){
			s.daemon.EncryptFileCMSEnvelopeEx_ByCert(json.base,certtype,path,path+'.'+json.suf,encAlg,function(state,code,data){
				if(state=='success'){
					json.success(path+'.'+json.suf);
				};
				s.errorcallback(json,state,code,data);
			});
		});
	};
	_s.Envelope.prototype.Msg=function(json){//消息加密
		var certtype;
		var encAlg;
		if(json.basealg=='SM4'){
			certtype='SM2';
			encAlg='1.2.840.113549.3.4';
		}else{
			if(json.basealg=='3DES'){
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			}else{
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			};
		};
		s.daemon.EncryptMsgCMSEnvelopeEx_ByCert(json.data,json.base,certtype,encAlg,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	//生成签章数据
	_s.GetPdfStdSealDataByKey=function(json){
		_s.iscert(json.dn,json,function(dn){
			_s.ispin(json.pin,json,function(pin){
				s.daemon.GetPdfStdSealDataByKey(json.hash,dn,pin,function(state,code,data){
					if(state=='success'){
						json.success(data);
					};
					s.errorcallback(json,state,code,data);
				});
			});
		});
	};
	//生成签章数据
	_s.GetPdfStdSealDataByPfx=function(json){
		s.daemon.GetPdfStdSealDataByPfx(json.hash,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	//按照坐标对本地文件进行签章
	_s.DoPdfStdSealByKeyAtPos=function(json){
		_s.ispath(json.path,json,function(path){
			_s.ispin(json.pin,json,function(pin){
				_s.iscert(json.dn,json,function(dn){
					_s.isseal(json.seal,pin,json,function(seal){
						s.daemon.DoPdfStdSealByKeyAtPos(path,dn,pin,seal,json.page,json.x,json.y,function(state,code,data){
							if(state=='success'){
								json.success(data);
							};
							s.errorcallback(json,state,code,data);
						});
					});
				});
			});
		});
	};
	//按照关键字对本地文件进行签章
	_s.DoPdfStdSealByKeyAtKw=function(json){
		_s.ispath(json.path,json,function(path){
			_s.ispin(json.pin,json,function(pin){
				_s.iscert(json.dn,json,function(dn){
					_s.isseal(json.seal,pin,json,function(seal){
						s.daemon.DoPdfStdSealByKeyAtKw(path,dn,pin,seal,json.kw,function(state,code,data){
							if(state=='success'){
								json.success(data);
							};
							s.errorcallback(json,state,code,data);
						});
					});
				});
			});
		});
	};
	_s.DoWordStdSealByKeyAtPos=function(json){
		s.daemon.DoWordStdSealByKeyAtPos(json.path,json.page,json.x,json.y,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.DoExcelStdSealByKeyAtPos=function(json){
		s.daemon.DoExcelStdSealByKeyAtPos(json.path,json.page,json.x,json.y,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetLocalCert=function(json){
		s.daemon.GetLocalCert(function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetSealInfoDlg=function(json){
		s.daemon.GetAEKeyID(function(state,code,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				s.Ui.FeitianPin({success:function(pin){
					s.daemon.OpenEKey(pin,function(state,code,data){
						if(state=='success'){
							json.pin=pin;
							s.daemon.GetEKeyPic(json.pin,function(state,code,seal){
								if(state=='success'){
				                    for(var i=0;i<seal.length;i++){
				                        seal[i].img='data:image/png;base64,'+seal[i].value;
				                    };
									s.Ui.Ui_Seal.show({
										data:seal,success:function(seal){
											json.success(seal);
										}
									});
								};
								s.errorcallback(json,state,code,seal);
							});
						};
						s.errorcallback(json,state,code,data);
					});
				}});
			};
			s.errorcallback(json,state,code,id);
		});
	};
	_s.InputPwd=function(json){
		s.Ui.FeitianPin({success:function(pin){
			if(pin=='1234'){
				json.success(pin);
			}else{
				s.errorcallback(json,'fail','0x0700000C',self.errorstate[0x0700000C]);
			};
		}});
	};
	_s.ApiInit=function(){
		s=this;
	};
};
//工具
/*-----
	加载文件
	浏览器参数
	判断IE7
	判断浏览器
	随机数
	大小写
	文件base64解码
-----*/
function UTCMiddleWare_Tool(){
	var s=UTCMiddleWare;
	var _s=this;
	//加载文件
	_s.loadcss=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var link = document.createElement('link');
	        link.href = path;
	        link.rel = 'stylesheet';
	        link.type = 'text/css';
	        head.appendChild(link);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     try{callback();}catch(e){};
			   }
			   script.onload=script.onreadystatechange=null;
			};
		}else{
			try{callback();}catch(e){};
		};
    };
    _s.loadjs=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var script = document.createElement('script');
	        script.src = path;
	        script.type = 'text/javascript';
	        head.appendChild(script);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     try{callback(true);}catch(e){};
			   }
			   script.onload=script.onreadystatechange=null;
			};
			script.onerror=function(){
				try{callback(false);}catch(e){};
			};
		}else{
			try{callback(true);}catch(e){};
		};
    };
	//浏览器参数
	_s.typearray=function(ele){
		var browser=navigator.userAgent;
		var version=browser.split(' ');
		var type=false;
		var num;
		for(var i=0;i<version.length;i++){
			var str=version[i];
			if(RegExp(ele).test(str)){
				type=true;
				num=i;
			};
		};
		return{
			type:type,
			num:num
		};
	};
	//判断IE7
	_s.Ie7=function(){
		var browser=navigator.userAgent;
		var version=browser.split(' ');
		if(_s.typearray('MSIE').type){
			var num=_s.typearray('MSIE').num;
			var onum = /^\d+\.\d+/;
            var vnum=onum.exec(version[num+1].replace(/[^0-9.]/ig,""));
            UTCMiddleWare.vnum=onum.exec(version[num+1].replace(/[^0-9.]/ig,""));
			if(vnum<8){
				return true;
			}else{
				return false;
			};
		};
	};
	//判断浏览器
	_s.Browser=function(){
		var ele=navigator.userAgent;
		if(ele.indexOf('Firefox')>=0){
			return 'Firefox';
		}else{
			if(ele.indexOf('Edge')>=0){
				return 'Edge';
			}else{
				if(ele.indexOf('Trident')>=0){
					return 'IE';
				}else{
					if(ele.indexOf('Opera')>=0){
						return 'Opera';
					}else{
						if(ele.indexOf('Chrome')>=0){
							return 'Chrome';
						}else{
							if(ele.indexOf('Safari')>=0){
								return 'Safari';
							}else{
								return 'Other';
							};
						};
					};
				};
			};
		};
	};
	//随机数
	_s.randomnum=function(a){
		var num='';
		for(var i=1;i<=a;i++){
			//var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
			var now=new Date();    
			var o = Math.floor(now.getMilliseconds()/1000*16);
			num+=chars[o];
		};
		return num;
	};
	//大小写
	_s.endWith=function(path,s){
		if(s==null||s==""||path.length==0||s.length>path.length){
			return false;
		}else{
			if(path.substring(path.length-s.length)==s){
				return true;
			}else{
				return false;
			};
		};
	};
	//文件base64解码
	_s.fromBase64=function(dataURI){
	    var raw = window.atob(dataURI);
	    var rawLength = raw.length;
	    var array = new Uint8Array(new ArrayBuffer(rawLength));
	
	    for(i = 0; i < rawLength; i++) {
	         array[i] = raw.charCodeAt(i);
	    }
	    return array;
	}
};
//底层接口列表
/*-----
	获取服务版本号
	获取钥匙序列号
	获取加密钥匙序列号
	加密钥匙序列号
	获取钥匙证书DN
	获取IE证书DN
	获取文件路径(系统)
	删除文件
	检测钥匙PIN码
	修改钥匙PIN码
	获取Base64
	验证文件有效性
	字符串签名
	验证字符串签名
	文件签名
	文件签名（文件数据）
	非分离式文件签名
	验证分离式文件签名
	消息加密
	文件加密
	文件签章
	hash值签章
	表单签章（电子钥匙）
	表单签章（服务器）
	表单签章获取ID
	表单签章验证
	获取印章图片数据
	获取临时路径
	创建印章图片
	文件生成签章数据
	读取身份证信息（亚略特）
	读取身份证信息（中控）
	读授权名
	读授权日期
-----*/

function UTCMiddleWare_Daemon(){
	var self=this;
	var s=UTCMiddleWare;
	var _s=this;
	//获取服务版本号
	self.PluginVersion=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'PluginVersion',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取钥匙序列号
	self.GetAEKeyID=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'getKeyID',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取钥匙证书DN
	self.getKeyCert=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'getCert',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取IE证书DN
	self.GetLocalCert=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetLocalCertDn',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取文件路径(系统)
	self.GetLocalFilePath=function(suffix,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetLocalFilePath',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//检测钥匙PIN码
	self.OpenEKey=function(password,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'ChkKeyPin',
			value:{
				pin:password,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//修改钥匙PIN码
	self.ChangePIN=function(oldpw,newpw,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'ChangePin',
			value:{
				oPin:oldpw,
				nPin:newpw,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----数字签名-----*/
	//字符串签名
	self.SignString=function(password,DN,blank,source, selectedAlg, bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignMsg',
			value:{
				pin:password,
				data:source,
				dn:DN||'',
				hashAlg:selectedAlg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//字符串签名分离
	self.SignStringDetach=function(password,DN,blank,source, selectedAlg, bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignMsgDetached',
			value:{
				pin:password,
				data:source,
				dn:DN||'',
				hashAlg:selectedAlg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证字符串签名
	self.VerifyString=function(source, message,certtype,bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyMsg',
			value:{
				signVal:message,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证字符串签名分离
	self.VerifyStringDetach=function(source, message,certtype,bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyMsgDetached',
			value:{
				signVal:message,
				data:source,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件签名
	self.DoSignFile=function(password,DN,path,hachtype,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignFileDetachedToMsg',
			value:{
				pin:password,
				srcFile:path,
				dn:DN||'',
				hashAlg:hachtype,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//非分离式文件签名
	self.DoSignFile2=function(password,DN,path,hachtype,suf,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignFile',
			value:{
				pin:password,
				srcFile:path,
				outFile:suf,
				dn:DN||'',
				hashAlg:hachtype,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证分离式文件签名
	self.VerifyFileSign=function(source,certtype,path,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyFileDetached',
			value:{
				signVal:source,
				srcFile:path,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证多个分离式文件签名
	self.VerifyFilesSign=function(datapath,path,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyFileDetached',
			value:{
				signValFile:path,
				srcFiles:datapath,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//对多个hash值进行分离式签名
	//对多hash值分离式签名进行验签
	/*-----数字签名-----*/
	/*-----数据加密-----*/
	//消息加密
	self.EncryptMsgCMSEnvelopeEx_ByCert=function(sourcestring,certbase64,certtype,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#");
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopMsg',
			value:{
				data:sourcestring,
				certInfo:certbase64n,
				encAlg:selectedAlgIndex,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件加密
	self.EncryptFileCMSEnvelopeEx_ByCert=function(certbase64,certtype,sourcefilepath,envelopefilepath,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#"); 
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopFile',
			value:{
				srcFile:sourcefilepath,
				outFile:envelopefilepath,
				certInfo:certbase64n,
				encAlg:selectedAlgIndex,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----数据加密-----*/
	/*-----电子签章-----*/
	//生成签章数据
	self.GetPdfStdSealDataByKey = function(hash,dn,pin,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetPdfStdSealDataByKey',
			value:{
				fileAbs:hash,
				pwd:pin,
				keyDn:dn,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	self.GetPdfStdSealDataByPfx = function(hash,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetPdfStdSealDataByPfx',
			value:{
                fileAbs:hash,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地PDF文件进行签章
	self.DoPdfStdSealByKeyAtPos = function(path,dn,pin,img,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoPdfStdSealByKeyAtPos',
			value:{
				sourceFile:path,
				pinCode:pin,
				dnName:dn,
				imgBase64:img,
				pageNo:page,
				xPosition:x,
				yPosition:y,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照关键字对本地PDF文件进行签章
	self.DoPdfStdSealByKeyAtKw = function(path,dn,pin,img,kw,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoPdfStdSealByKeyAtKw',
			value:{
				sourceFile:path,
				pinCode:pin,
				dnName:dn,
				imgBase64:img,
				charString:kw,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地WORD文件进行签章
	self.DoWordStdSealByKeyAtPos = function(path,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoSealInWordByCoord',
			value:{
				sSourceFile:path,
				xPosition:x,
				yPosition:y,
				pageNo:page,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地Excel文件进行签章
	self.DoExcelStdSealByKeyAtPos = function(path,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoSealInExcelByCoord',
			value:{
				sSourceFile:path,
				xPosition:x,
				yPosition:y,
				pageNo:page,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----电子签章-----*/
	//获取印章图片数据
	self.GetEKeyPic=function(password,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetSealImage',
			value:{
				pin:password,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
};

UTCMiddleWare_Function.prototype=new UTCMiddleWare_Api();
var UTCMiddleWare=new UTCMiddleWare_Function();
UTCMiddleWare.Initialize();
//界面
/*-----
UTCMiddleWare.Ui.Cert({
	data:'',
	success:function(data){
	}
});
UTCMiddleWare.Ui.Seal({
	data:'',
	success:function(data){
	}
});
UTCMiddleWare.Ui.Pin({
	success:function(pin){
	}
});
-----*/
function UTCMiddleWare_Ui(){
	var s=UTCMiddleWare;
	var _s=this;
	//添加样式
	_s.AddStyle=function(){
		if (!("classList" in document.documentElement)&&typeof(HTMLElement)!='undefined') {
		    Object.defineProperty(HTMLElement.prototype, 'classList', {
		        get: function() {
		            var self = this;
		            function update(fn) {
		                return function(value) {
		                    var classes = self.className.split(/\s+/g),
		                        index = classes.indexOf(value);
		                    
		                    fn(classes, index, value);
		                    self.className = classes.join(" ");
		                }
		            }
		            
		            return {                    
		                add: update(function(classes, index, value) {
		                    if (!~index) classes.push(value);
		                }),
		                
		                remove: update(function(classes, index) {
		                    if (~index) classes.splice(index, 1);
		                }),
		                
		                toggle: update(function(classes, index, value) {
		                    if (~index)
		                        classes.splice(index, 1);
		                    else
		                        classes.push(value);
		                }),
		                
		                contains: function(value) {
		                    return !!~self.className.split(/\s+/g).indexOf(value);
		                },
		                
		                item: function(i) {
		                    return self.className.split(/\s+/g)[i] || null;
		                }
		            };
		        }
		    });
		};
		if (!Array.prototype.indexOf){
		  Array.prototype.indexOf = function(elt /*, from*/){
		    var len = this.length >>> 0;
		
		    var from = Number(arguments[1]) || 0;
		    from = (from < 0)
		         ? Math.ceil(from)
		         : Math.floor(from);
		    if (from < 0)
		      from += len;
		
		    for (; from < len; from++){
		      if (from in this && this[from] === elt)
		        return from;
		    }
		    return -1;
		  };
		}
		var csscon=document.createElement("style");
		csscon.type='text/css'; 
		var stylecon='.utc_popupbox{ position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.4); opacity: 0; z-index: 100;transition: none;-moz-transition: none;-webkit-transition: none;-o-transition: none;}.utc_popupbox *{ margin: 0; padding: 0; color: #333333;}.utc_popupbox ol,.utc_popupbox ul{list-style:none; overflow: hidden;}.utc_popupbox li{ float: left;}.utc_popupbox img{ border: none;}.utc_popupbox input,.utc_popupbox button,.utc_popupbox textarea{ border: none; background-color: transparent; vertical-align:middle; outline: none; overflow: visible;}.utc_popupbox .utc_popupbg{ width: 100%; height: 100%; background-color: #000000; filter:alpha(opacity=40);}.utc_popupbox .utc_popupbg{ background-color: rgba(0,0,0,0);}.utc_popupbox .utc_popup{ position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background-color: #FFFFFF; overflow: auto;}.utc_popupbox .utc_title{ height: 40px; line-height: 40px; padding: 0 20px; font-size: 16px;}.utc_popupbox .utc_con{ margin: 0 20px; overflow: auto;}.utc_popupbox .utc_btn{ height: 50px;}.utc_popupbox .utc_btn button{ float: right; height: 30px; margin: 10px; padding: 0 20px; font-size: 14px; background-color: transparent; border-radius: 2px; cursor: pointer;}.utc_popupbox .utc_btn button.close:hover{ background-color: #F2F2F2;}.utc_popupbox .utc_btn button.sure{ color: #FFFFFF; background-color: #00C0A5;}.utc_popupbox .utc_btn button.sure.none{ color: #FFFFFF; background-color: #CCCCCC; cursor: default;}object{ display: none;}';
	    stylecon+='.utc_popupbox.certlist .utc_popup{ width: 500px; height: 400px;}.utc_popupbox.certlist .utc_con{ height: 310px; height: calc(100% - 90px);}.utc_popupbox.certlist .utc_popup .oper{ height: 40px;}.utc_popupbox.certlist .utc_popup .oper li{ position: relative; width: 50%; line-height: 40px; font-size: 14px; text-align: center; cursor: pointer;}.utc_popupbox.certlist .utc_popup .oper li.active::after{ content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 2px; background-color: #00C0A5;}.utc_popupbox.certlist .utc_popup dt{ margin-top: 10px; padding: 10px; color: #999999; text-align: center;}.utc_popupbox.certlist .utc_popup dd{ margin-top: 10px; padding: 10px; border: 2px solid transparent; border-radius: 10px; cursor: pointer;}.utc_popupbox.certlist .utc_popup dd:hover{ background-color: #e5f9f6;}.utc_popupbox.certlist .utc_popup dd.active{ border-color: #00C0A5;}.utc_popupbox.certlist .utc_popup dd span{ display: block; font-size: 14px; color: #999999; word-break: break-all;}.utc_popupbox.certlist .utc_popup dd span.name{ font-size: 16px; color: #333333;}';
	    stylecon+='.utc_popupbox.seallist .utc_popup{ width: 550px; height: 450px;}.utc_popupbox.seallist .utc_con{ height: 400px; height: calc(100% - 50px);}.utc_popupbox.seallist .utc_con dl{ overflow: hidden;}.utc_popupbox.seallist .utc_con dl dt{ line-height: 40px; color: #999999;}.utc_popupbox.seallist .utc_con .img{ height: 30px; line-height: 30px; font-size: 14px; padding: 0 5px; border: 2px solid transparent; margin-bottom: 5px; background-position: center; background-repeat: no-repeat; cursor: pointer; border-radius: 10px;}.utc_popupbox.seallist .utc_con .img:hover{ background-color: #e5f9f6;}.utc_popupbox.seallist .utc_con .img.active{ border-color: #00C0A5;}.utc_popupbox.seallist .utc_con .hint{ font-size: 14px; color: #999999; text-align: center;}';
	    stylecon+='.utc_popupbox.password .utc_popup{ width: 350px; height: 220px;}.utc_popupbox.password .utc_con{ height: 130px; height: calc(100% - 90px);}.utc_popupbox.password input{ display: block; width: 250px; height: 40px; margin: 0 auto; margin-top: 30px; padding: 0 5px; line-height: 40px; font-size: 30px; border: 2px solid #CCCCCC; border-radius: 2px;}.utc_popupbox.password .hint{ display: block; margin-top: 10px; font-size: 14px; color: #EE5555; text-align: center;}';
	    stylecon+='.utc_popupbox.loading .utc_popup{ width: 200px; height: 130px;}.utc_popupbox.loading .utc_popup img{ display: block; margin: 0 auto; margin-top: 30px;}.utc_popupbox.loading .utc_popup .hint{ height: 30px; line-height: 30px; text-align: center;}.utc_popupbox.loading button.close{ float: right; margin: 5px; font-size: 14px;}';
	    stylecon+='	.utc_popupbox.feitianpin .utc_popup{ width: 350px; height: 190px; box-shadow: 0 5px 5px #666666;}.utc_popupbox.feitianpin .utc_title{ height: 30px; line-height: 30px; padding: 0; padding-left: 10px; font-size: 14px;}.utc_popupbox.feitianpin .utc_title button{ float: right; width: 30px; height: 30px; line-height: 30px; text-align: center; font-weight: bold; cursor: pointer;}.utc_popupbox.feitianpin .utc_title button:hover{ color: #FFFFFF; background-color: #EE5555;}.utc_popupbox.feitianpin .utc_title button:active{opacity: 0.8;}.utc_popupbox.feitianpin .utc_con{ margin: 0px; padding: 10px; background-color: #F0F0F0;}.utc_popupbox.feitianpin .top{ overflow: hidden;}.utc_popupbox.feitianpin .top .img{ float: left; width: 40px; height: 40px;}.utc_popupbox.feitianpin .top .img img{ margin: 6px 4px;}.utc_popupbox.feitianpin .top .hint{ float: left; margin-left: 10px;}.utc_popupbox.feitianpin .top .hint span{ display: block; height: 20px; line-height: 20px; font-size: 14px;}.utc_popupbox.feitianpin .middle{ height: 30px; margin-top: 5px; margin-left: 50px; overflow: hidden;}.utc_popupbox.feitianpin .middle span{ float: left; line-height: 30px; font-size: 14px;}.utc_popupbox.feitianpin .middle .pin{ float: left; height: 30px; margin-left: 10px; padding: 0 5px; background-color: #FFFFFF; box-shadow: inset 0 0 5px #999999;}.utc_popupbox.feitianpin .middle .pin:hover{box-shadow: inset 0 0 5px #666666;}.utc_popupbox.feitianpin .middle .pin:focus{box-shadow: inset 0 0 5px #666666;}.utc_popupbox.feitianpin .bottom{ margin-top: 5px; margin-left: 50px; overflow: hidden;}.utc_popupbox.feitianpin .bottom label{ display: block; float: left; height: 20px; margin-left: 65px; overflow: hidden; cursor: pointer;}.utc_popupbox.feitianpin .bottom input{ float: left; width: 20px; height: 20px; cursor: pointer;}.utc_popupbox.feitianpin .bottom span{ float: left; height: 20px; line-height: 20px; margin-left: 5px; font-size: 14px;}.utc_popupbox.feitianpin .pin{ float: left;}.utc_popupbox.feitianpin .softkey{ display: none;}.utc_popupbox.feitianpin .utc_btn{ height: 40px; margin: 0px; padding: 0 0px; background-color: #F0F0F0;}.utc_popupbox.feitianpin .utc_btn button{ float: left; width: 100px; margin: 0; margin-left: 10px; border: 1px solid transparent;}.utc_popupbox.feitianpin .utc_btn button.sure{}.utc_popupbox.feitianpin .utc_btn button.change{ border-color: #999999;}.utc_popupbox.feitianpin .utc_btn button.close{ }.utc_popupbox.feitianpin .utc_btn button:hover{ opacity: 0.8;}.utc_popupbox.feitianpin .utc_btn button:active{ opacity: 1;}.utc_popupbox.feitianpin.softkey .utc_popup{ width: 510px; height: 340px;}.utc_popupbox.feitianpin.softkey .softkey{ display: block;}';
		stylecon+='.UTC_Softkey{ background-color: #F2F2F2; border-spacing: 0;}.UTC_Softkey td{ margin: 0; padding: 0;}.UTC_Softkey button{ display: block; width: 30px; height: 30px; font-size: 16px; border: none; background-color: transparent; cursor: pointer; outline: none;}.UTC_Softkey button:hover{ background-color: #E3E3E3;}.UTC_Softkey button:active{ background-color: #D4D4D4;}.UTC_Softkey button.backspace{ width: 60px; font-size: 14px;}.UTC_Softkey button.enter{ width: 90px; height: 60px; font-size: 14px;}.UTC_Softkey button.shift{ width: 120px; font-size: 14px;}';
		stylecon+='.utc_popupbox.changepin .utc_popup{ width: 350px; height: 305px; box-shadow: 0 5px 5px #666666;}.utc_popupbox.changepin .utc_title{ height: 30px; line-height: 30px; padding: 0; padding-left: 10px; font-size: 14px;}.utc_popupbox.changepin .utc_title button{ float: right; width: 30px; height: 30px; line-height: 30px; text-align: center; font-weight: bold; cursor: pointer;}.utc_popupbox.changepin .utc_title button:hover{ color: #FFFFFF; background-color: #EE5555;}.utc_popupbox.changepin .utc_title button:active{opacity: 0.8;}.utc_popupbox.changepin .utc_con{ margin: 0px; padding: 10px; background-color: #F0F0F0;}.utc_popupbox.changepin .inputbox{ margin-bottom: 10px;}.utc_popupbox.changepin .inputbox span{ display: block; height: 20px; line-height: 20px; margin-left: 20px; font-size: 14px;}.utc_popupbox.changepin .inputbox input{ display: block; width: 280px; height: 30px; margin-top: 5px; margin-left: 20px; padding: 0 5px; background-color: #FFFFFF; box-shadow: inset 0 0 5px #999999;}.utc_popupbox.changepin .inputbox input:hover{box-shadow: inset 0 0 5px #666666;}.utc_popupbox.changepin .inputbox input:focus{box-shadow: inset 0 0 5px #666666;}.utc_popupbox.changepin .hint{ height: 20px; line-height: 20px; margin-left: 20px; font-size: 14px; color: #EE5555;}.utc_popupbox.changepin .utc_btn{ height: 40px; margin: 0px; padding: 0 0px; background-color: #F0F0F0;}.utc_popupbox.changepin .utc_btn button{ float: left; width: 100px; margin: 0; margin-left: 10px; border: 1px solid transparent;}.utc_popupbox.changepin .utc_btn button.sure{}.utc_popupbox.changepin .utc_btn button.close{ }.utc_popupbox.changepin .utc_btn button:hover{ opacity: 0.8;}.utc_popupbox.changepin .utc_btn button:active{ opacity: 1;}';
	    if(csscon.styleSheet){         //ie下
	    	csscon.styleSheet.cssText = stylecon;  
	    } else {  
	    	csscon.innerHTML = stylecon;       //或者写成 nod.appendChild(document.createTextNode(str))  
	    }  
		document.getElementsByTagName('head')[0].appendChild(csscon);
	};
	_s.Cert=function(json){
		_s.Ui_Cert.show(json);
	};
	_s.Seal=function(json){
		_s.Ui_Seal.show(json);
	};
	_s.Pin=function(json){
		_s.Ui_Pin.show(json);
	};
	_s.FeitianPin=function(json){
		_s.Ui_FeitianPin.show(json);
	};
	_s.Init=function(){
		_s.AddStyle();
		_s.Ui_Cert=new UTCMiddleWare_Ui_Cert();
		_s.Ui_Seal=new UTCMiddleWare_Ui_Seal();
		_s.Ui_Pin=new UTCMiddleWare_Ui_Pin();
		_s.Loading=new UTCMiddleWare_Ui_Loading();
		_s.Ui_FeitianPin=new UTCMiddleWare_Ui_FeitianPin();
		_s.Ui_ChangePin=new UTCMiddleWare_Ui_ChangePin();
	};
	_s.Init();
};

//选证书
function UTCMiddleWare_Ui_Cert(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.getcn=function(dn){
		var cn=dn;
		cn=dn.match(/CN=.+?,/)[0];
		cn=cn.substring(3,cn.length-1);
		return cn;
	};
	_s.load=function(callback){
		var list=_s.json.data;
		if(Object.prototype.toString.call(list)!='[object Array]'||list.length==0){
			_s.json.success('');
		}else{
			if(list.length==1){
				_s.json.success(list[0]);
			}else{
				try{callback();}catch(e){};
				document.querySelector('.utc_popupbox.certlist dl').innerHTML='';
				for(var i=0;i<list.length;i++){
					var node=document.createElement("dd");
					node.setAttribute('num',i);
					node.innerHTML='<span class="name">证书名：'+_s.getcn(list[i].SubjectName)+'</span><span>颁发机构 '+list[i].IssuerName+'</span><span>序列号 '+list[i].SerialNumber+'</span><span>有效期 '+list[i].NotBefore+' 至 '+list[i].NotAfter+'</span>';
					document.querySelector('.utc_popupbox.certlist dl').appendChild(node);
					_s.eventlist(0,i);
				};
				_s.addClass(document.querySelectorAll('.utc_popupbox.certlist dl dd')[0],'active');
			};
		};
	};
	_s.show=function(json){
		_s.json=json;
		_s.load(function(){
			var node=document.createElement("div");
			_s.addClass(node,'utc_popupbox');
			_s.addClass(node,'certlist');
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">选择证书</div><div class="utc_con"><dl></dl></div><div class="utc_btn"><button class="sure">确定</button><button class="close">关闭</button></div></div>';
			node.innerHTML=divbox;
			if(document.querySelectorAll('.utc_popupbox.certlist').length==0){
				document.body.appendChild(node);
				_s.fadeIn(document.querySelector('.utc_popupbox.certlist'));
				_s.eventbox();
			};
		});
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.certlist'),function(){
			document.querySelector('.utc_popupbox.certlist').parentNode.removeChild(document.querySelector('.utc_popupbox.certlist'));
		});
	};
	_s.sure=function(){
		_s.json.success(_s.json.data[document.querySelector('.utc_popupbox.certlist dl dd.active').getAttribute('num')]);
		_s.close();
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.eventbox=function(){
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.certlist .oper li').length;o++){
			document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].index=o;
			if(document.addEventListener){
				document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].addEventListener('click', function(){
					var _this=this;
					_s.eventboxfun1(_this);
				});
			}else{
				document.querySelectorAll('.utc_popupbox.certlist .oper li')[o].attachEvent('onclick', function(e){
					e=e||window.event;
	                var _this=e.srcElement||e.target;
					_s.eventboxfun1(_this);
				});
			};
		};
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.certlist .close').addEventListener('click', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.certlist .sure').addEventListener('click', function(){
				_s.eventboxfun3();
			});
		}else{
			document.querySelector('.utc_popupbox.certlist .close').attachEvent('onclick', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.certlist .sure').attachEvent('onclick', function(){
				_s.eventboxfun3();
			});
		};
	};
	_s.eventboxfun1=function(_this){
		for(var i=0;i<document.querySelectorAll('.utc_popupbox.certlist dl').length;i++){
			_s.removeClass(document.querySelectorAll('.utc_popupbox.certlist dl')[i],'show');
		};
		_s.addClass(document.querySelectorAll('.utc_popupbox.certlist dl')[_this.index],'show');
	};
	_s.eventboxfun2=function(){
		_s.close();
	};
	_s.eventboxfun3=function(){
		_s.sure();
	};
	_s.eventlist=function(e,i){
		if(document.addEventListener){
			document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i].addEventListener('click', function(){
				var _this=this;
				_s.eventlistfun(e,_this);
			});
		}else{
			document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i].attachEvent('onclick', function(w){
				w=w||window.event;
                var _this=document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[i];
				_s.eventlistfun(e,_this);
			});
		};
	};
	_s.eventlistfun=function(e,_this){
		document.querySelectorAll('.utc_popupbox.certlist dl')[e].setAttribute('num',_this.getAttribute('num'));
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.certlist dl')[e].children.length;o++){
			_s.removeClass(document.querySelectorAll('.utc_popupbox.certlist dl')[e].children[o],'active');
		};
		_s.addClass(_this,'active');
	};
	_s.initialize=function(){
	};
	_s.initialize();
};

//选印章
function UTCMiddleWare_Ui_Seal(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.name=function(name){
		if(name==null||name==''){
			var newname;
			switch(name){
				case '11' :
				newname='印章一';
				break;
				case '12' :
				newname='签字一';
				break;
				case '13' :
				newname='水印一';
				break;
				case '14' :
				newname='印章二';
				break;
				case '15' :
				newname='印章三';
				break;
				default:
				newname='印章';
			};
			return newname;
		}else{
			return name;
		};
	};
	_s.load=function(callback){
		var obj=_s.json.data
		if(Object.prototype.toString.call(obj)!='[object Array]'||obj.length==0){
			_s.json.success(obj);
		}else{
			if(obj.length==1){
				_s.json.success(obj[0]);
			}else{
				try{callback();}catch(e){};
				var sealarray=[];
				var signarray=[];
				var waterarray=[];
				for(var i=0;i<obj.length;i++){
					switch(obj[i].id){
						case '12' :
							signarray.push(obj[i]);
						break;
						case '13' :
							waterarray.push(obj[i]);
						break;
						default :
							sealarray.push(obj[i]);
						break;
					};
				};
				var imgcon='';
				imgcon+='<dl class="seal"><dt>印章</dt></dl>';
				imgcon+='<dl class="sign"><dt>签名</dt></dl>';
				imgcon+='<dl class="water"><dt>水印</dt></dl>';
				document.querySelector('.utc_popupbox.seallist .utc_con').innerHTML=imgcon;
				for(var i=0;i<sealarray.length;i++){
					var node=document.createElement('dd');
					node.setAttribute('num',sealarray[i].id);
					node.innerHTML=_s.name(sealarray[i].name);
					_s.addClass(node,'img');
					if(document.querySelector('.utc_popupbox.seallist .utc_con .seal')){
						document.querySelector('.utc_popupbox.seallist .utc_con .seal').appendChild(node);
					};
				};
				for(var i=0;i<signarray.length;i++){
					var node=document.createElement('dd');
					node.setAttribute('num',signarray[i].id);
					node.innerHTML=_s.name(signarray[i].name);
					_s.addClass(node,'img');
					if(document.querySelector('.utc_popupbox.seallist .utc_con .sign')){
						document.querySelector('.utc_popupbox.seallist .utc_con .sign').appendChild(node);
					};
				};
				for(var i=0;i<waterarray.length;i++){
					var node=document.createElement('dd');
					node.setAttribute('num',waterarray[i].id)
					node.innerHTML=_s.name(waterarray[i].name);
					_s.addClass(node,'img');
					if(document.querySelector('.utc_popupbox.seallist .utc_con .water')){
						document.querySelector('.utc_popupbox.seallist .utc_con .water').appendChild(node);
					};
				};
				_s.addClass(document.querySelectorAll('.utc_popupbox.seallist .img')[0],'active');
				if(sealarray.length==0){
					var nonode=document.createElement("div");
					_s.addClass(nonode,'hint');
					nonode.innerHTML='没有可选择的印章';
					if(document.querySelector('.utc_popupbox.seallist .utc_con .seal')){
						document.querySelector('.utc_popupbox.seallist .utc_con .seal').appendChild(nonode);
					};
				};
				if(signarray.length==0){
					var nonode=document.createElement("div");
					_s.addClass(nonode,'hint');
					nonode.innerHTML='没有可选择的签名';
					if(document.querySelector('.utc_popupbox.seallist .utc_con .sign')){
						document.querySelector('.utc_popupbox.seallist .utc_con .sign').appendChild(nonode);
					};
				};
				if(waterarray.length==0){
					var nonode=document.createElement("div");
					_s.addClass(nonode,'hint');
					nonode.innerHTML='没有可选择的水印';
					if(document.querySelector('.utc_popupbox.seallist .utc_con .water')){
						document.querySelector('.utc_popupbox.seallist .utc_con .water').appendChild(nonode);
					};
				};
				_s.eventlist();
			};
		};
	};
	_s.show=function(json){
		_s.json=json;
		_s.load(function(){
			var node=document.createElement("div");
			_s.addClass(node,'utc_popupbox');
			_s.addClass(node,'seallist');
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_con"></div><div class="utc_btn"><button class="sure">确定</button><button class="close">关闭</button></div></div>';
			node.innerHTML=divbox;
			document.body.appendChild(node);
			_s.fadeIn(document.querySelector('.utc_popupbox.seallist'));
			document.querySelector('.utc_popupbox.seallist .sure').focus();
			_s.eventbox();
		});
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.seallist'),function(){
			document.querySelector('.utc_popupbox.seallist').parentNode.removeChild(document.querySelector('.utc_popupbox.seallist'));
		});
	};
	_s.sure=function(){
		for(var i=0;i<_s.json.data.length;i++){
			if(_s.json.data[i].id==document.querySelector('.utc_popupbox.seallist .img.active').getAttribute('num')){
				_s.json.success(_s.json.data[i]);
				_s.close();
			};
		};
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){/*console.log(e.message)*/};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.eventbox=function(){
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.seallist .close').addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.seallist .sure').addEventListener('click', function(){
				_s.eventboxfun2();
			});
		}else{
			document.querySelector('.utc_popupbox.seallist .close').attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.seallist .sure').attachEvent('onclick', function(){
				_s.eventboxfun2();
			});
		};
	};
	_s.eventboxfun1=function(){
		_s.json.fail('0x07000010',s.errorstate[0x07000010]);
		_s.close();
	};
	_s.eventboxfun2=function(){
		_s.sure();
	};
	_s.eventlist=function(){
		if(document.addEventListener){
			for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
				document.querySelectorAll('.utc_popupbox.seallist .img')[o].addEventListener('click', function(){
					var _this=this;
					_s.eventlistfun(_this);
				});
			};
		}else{
			for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
				document.querySelectorAll('.utc_popupbox.seallist .img')[o].attachEvent('onclick', function(e){
                    e=e||window.event;
                    var _this=e.srcElement||e.target;
					_s.eventlistfun(_this);
				});
			};
		};
	};
	_s.eventlistfun=function(_this){
		for(var o=0;o<document.querySelectorAll('.utc_popupbox.seallist .img').length;o++){
			_s.removeClass(document.querySelectorAll('.utc_popupbox.seallist .img')[o],'active');
		};
		_s.addClass(_this,'active');
	};
	_s.initialize=function(){
	};
	_s.initialize();
};

//输密码
function UTCMiddleWare_Ui_Pin(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.show=function(json){
		_s.json=json;
		var node=document.createElement("div");
		_s.addClass(node,'utc_popupbox');
		_s.addClass(node,'password');
		var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">输入PIN码</div><div class="utc_con"><input type="password" autocomplete="off"><span class="hint">密码输错5次钥匙将被锁，请仔细填写</span></div><div class="utc_btn"><button class="sure none" disabled>确定</button><button class="close">关闭</button></div></div>';
		node.innerHTML=divbox;
		if(document.querySelectorAll('.utc_popupbox.password').length==0){
			document.body.appendChild(node);
			_s.fadeIn(document.querySelector('.utc_popupbox.password'));
			document.querySelector('.utc_popupbox.password input').focus();
			_s.eventbox();
		};
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.password'),function(){
			document.querySelector('.utc_popupbox.password').parentNode.removeChild(document.querySelector('.utc_popupbox.password'));
		});
	};
	_s.sure=function(){
		_s.json.success(document.querySelector('.utc_popupbox.password input').value);
		_s.close();
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.ifsure=function(text){
		if(text!=''){
			_s.removeClass(document.querySelector('.utc_popupbox.password .sure'),'none');
			document.querySelector('.utc_popupbox.password .sure').removeAttribute('disabled');
		}else{
			_s.addClass(document.querySelector('.utc_popupbox.password .sure'),'none');
			document.querySelector('.utc_popupbox.password .sure').setAttribute('disabled',true);
		};
	};
	_s.eventbox=function(){
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.password .close').addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.password .sure').addEventListener('click', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.password input').addEventListener('keyup', function(e){
				if((e.which==13)&&document.querySelector('.utc_popupbox.password .sure').getAttribute('disabled')==null){
					_s.eventboxfun2();
				};
				var _this=this;
				_s.eventboxfun3(_this);
			});
		}else{
			document.querySelector('.utc_popupbox.password .close').attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.password .sure').attachEvent('onclick', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.password input').attachEvent('onkeyup', function(e){
				e=e||window.event;
	            var _this=e.srcElement||e.target;
	            _s.eventboxfun3(_this);
			});
		};
	};
	_s.eventboxfun1=function(){
		_s.close();
	};
	_s.eventboxfun2=function(){
		_s.sure();
	};
	_s.eventboxfun3=function(_this){
		_s.ifsure(_this.value);
	};
	_s.initialize=function(){
	};
	_s.initialize();
};

//loading
function UTCMiddleWare_Ui_Loading(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.num=0;
	_s.ran=null;
	_s.initialize=function(){
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.loading.ran'+_s.ran),function(){
			_s.num--;
			document.querySelector('.utc_popupbox.loading.ran'+_s.ran).parentNode.removeChild(document.querySelector('.utc_popupbox.loading.ran'+_s.ran));
		});
	};
	_s.show=function(text){
		if(document.querySelectorAll('.utc_popupbox.loading.ran'+_s.ran).length==0){
			_s.ran=UTCMiddleWare.tool.randomnum(4);
			var node=document.createElement("div");
			_s.addClass(node,'utc_popupbox');
			_s.addClass(node,'loading');
			_s.addClass(node,'ran'+_s.ran);
			var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><img src="data:image/gif;base64,R0lGODlhKAAoAJEDAAGg6v///6be+P///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkREREQ3N0ZCNzk4NzExRTY4QTY2Q0VFQkJFQjkyNENDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkREREQ3N0ZDNzk4NzExRTY4QTY2Q0VFQkJFQjkyNENDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RERERDc3Rjk3OTg3MTFFNjhBNjZDRUVCQkVCOTI0Q0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RERERDc3RkE3OTg3MTFFNjhBNjZDRUVCQkVCOTI0Q0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFBAADACwAAAAAKAAoAAACWIyPqcvtD6OctNo7gd68+6854EhuYol6Z8oCa4u+MCnPYG2rTV7ivLn73YJCHaP48QmVPybPmYPapDMqzNrCsrQpboyIBB7DHG8PTDbT0GGM+w2Py+f0SgEAIfkEBQQAAwAsBQAEAB4AIAAAAlOMgQLCEm6inBLZi9dqkOYPWl5IXmNZnmiorl/rYnAsTjQ43zm9x737WwVRw5TtlimSlKwj0uR8Ipi4qJT6sj6xSS2SK/PqxB8F50EJWMzntDtQAAAh+QQFBAADACwIAAMAGAAiAAACTowhacvtAGMSrp6I4bQre7w13xg95GieXqpibAu9sNzSqn3ipI6KsOv7xYJC3se4Iv6QGSaQISwpZ9Na9XbNZXfbHvSn4IU5njHnaz4vCgAh+QQFBAADACwLAAIAEgAkAAACTowhpsuH2SKYE0ZFqbAyZ7543taIYmlmaDqtrJvCpnwyLEV7uWrfwI7r3YAt4csYQ86UtZCP+GPqpDznkBq0pkCBY2d66VbD4igZc1YUAAAh+QQFBAADACwOAAEADAAmAAACQ4xlqQa4CsCDbbLoXsRzx+5lifctpGSSmpp6q9turxyXFHzTuT2yO/qb8S64XpGoMyaRw8BJKGKCOK9oz9qzMLAJbgEAIfkEBQQAAwAsEQABAAYAJgAAAg2Mj6nL7Q+jnLTai20BACH5BAUEAAMALBEAAQAGACYAAAIhnC03AgqNXpTsNfsq3rz7D4biSJbmpkmbgU3QIh1xpCwFACH5BAUEAAMALA4AAQAMACYAAAIrjI+pBhsCohIwtlOtfFmD7oXiSJbmiabqyrbuC8fy7AXmQSbiUjuWgwMeCgAh+QQFBAADACwLAAIAEgAkAAACLoyPqYsiAJhxsMb2rI50+w+G4kiW5omm6sq27gvH8kzXNuBkZJKHUq+R8ChCRgEAIfkEBQQAAwAsCAADABgAIgAAAjOMj6nLJv+AADQICyXdvPsPhuJIluaJpurKtu4Lx/JM1/aN5/rOuw40mZgaiAtQUyEqDQUAIfkEBQQAAwAsBQAEAB4AIAAAAiWMj6lr4A+jnLTai7PevPsPhuJIluaJpurKtu4Lx/JM1zOD50cBACH5BAUEAAMALAQABQAgAB4AAAJIjI+py+0PYwK02ouz3rz7D4aZIIhhaXpkqqLstr6wK2NCUGtGnu385ftVgkIA8XcL0H6GZS7prEGLgGnRKkziigiq5AsOi8UFACH5BAUEAAMALAMACAAiABgAAAJEjI+py+0P4wO02ouz3rxT4YWZEIhmRZ6noZoG2HZkAMfbXNobou9HP0LUgB8h0YJjHSmKJTMx7CVfy6mSKMlqt9zuogAAIfkEBQQAAwAsAgALACQAEgAAAjCMj6nL7Q+jPKDai7PeYfuvGeAIUuR5IegKJCypvOMie0zN3Xja7HzvmwiHxKKxUQAAIfkEBQQAAwAsAQAOACYADAAAAiiMj6nL7Q+jbALYi7PeXBgOhpt3VOKpkYmJoqrCtmAUy9c75frO91ABACH5BAUEAAMALAEAEQAmAAYAAAINjI+py+0Po5y02ottAQAh+QQFBAADACwBABEAJgAGAAACHJw/AsvtDwSaCNq7JDUK+6dN3UcyYVKmDqe2ZgEAIfkEBQQAAwAsAQAOACYADAAAAiiML6DL7SuOnK9aNXO4vEVtdKLygeNYUudormIaum8mo1J93vi87XMBACH5BAUEAAMALAIACwAkABIAAAI9jCOgy+0tjkSvWhWnSbezrHniohnjWHJnBx7qarUm7IV0Z9+x9OpO2/N9JMILsVhxISuZ4BKQeSYD0kegAAAh+QQFBAADACwDAAgAIgAYAAACRYyBqcttL5qcSrxDM7sh6o9YEAiKhkdmZpdqa+teKCxddGbfU647T187ARum4UZorCCToSVTNEuKmBVLNImhIrJaLjVQAAA7"><div class="hint">正在加载</div><button  class="close">关闭</button></div>';
			_s.num++;
			node.innerHTML=divbox;
			document.body.appendChild(node);
			_s.fadeIn(document.querySelector('.utc_popupbox.loading.ran'+_s.ran));
			_s.eventbox();
		};
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.eventbox=function(){
		if(document.addEventListener){
			document.querySelector('.utc_popupbox.loading .close').addEventListener('click', function(){
				_s.eventboxfun1();
			});
		}else{
			document.querySelector('.utc_popupbox.loading .close').attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
		};
	};
	_s.eventboxfun1=function(){
		_s.close();
	};
	_s.initialize();
};

//飞天输密码
function UTCMiddleWare_Ui_FeitianPin(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.show=function(json){
		_s.json=json;
		var node=document.createElement("div");
		_s.addClass(node,'utc_popupbox');
		_s.addClass(node,'feitianpin');
		var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">用户pin码验证<button class="close">X</button></div><div class="utc_con"><div class="top"><div class="img"><img src="data:image/gif;base64,R0lGODlhIAAbAPcAAEaZT1ZVVUtWcVSH2f+yTLa7xROLEz20PbKysoRzUafMqlm0WmqF/Q4MDHMwEv6cNsnKyRlDt+Tk5JbH//+pQ5uTcNhyJklJSf+iPDepNygoKDJX1de5gqJLGFV36/+6VDVkztLS0uJ7KTaTN7hSG86cRTePSiVoJYlDFraKNZ6FVOn9+/X9/ujo6LZ4GKKiopczEN3d3Q4maNnr/ydcg9uNKXPSczlW41PCUyt1KDQ0NNWEH/OTLa2trYmJiXeJyn18fal3GODg4EmmStTU1GHJYcNcHtqZPGR8/W9dlYKCgitO1l50/cLCwrm0q6rd/WpqbMqJKjgcDbu5tJycnCJAiGtRLueQKiVKytipWIabhu3t7bWFLMeVOzhCdunNnIZlJpp0G3AYClls/O/v75SalEFs2VZmUSpUxcxmIv+3UVFk+uSMJq97Iurq6iOjI2Ztfj09PUlq5tjY2OXGkgtsC1h09GFhYaqqqvGLLkhe8t22cvuYM8G9tubm5Utg9HlBFyeNJ7NNGc3KxWTFZCVcsv+mQGjNaLSSUVZp/CBOvNNtJJqXlFnGWYqGhGG+Yfr8//eRMJKQjr6+v+G7euqELEu+S+XEjJKSk34dCvDw8P/AWnzXfP+/Wf+uSBM8pdXT0G1/qX1gKW8bIIyQnHSodN20a4eZwJegl7mUTkxlTFx0XMjEvnu2f8R8FsmPO3Sn5jUpJXM8VUqffzGyMYLagpzFsYy8+9qfPOyuSDFR2jZcyGFyYbC+sDxbPO6GMF9EPGeWZ0V8J6qZeUQYCruyn1Q1Mi1+gzKAiGQ1JcDDy8rHwWyvefWLL2S8fMOhYc2tcayfhtKqYeWhPdfUzsp0JLJzDcLp2zkQJiEcGePj5pzP/adBFTCdMMfh9JdsKLSAHlJo93Cj3lSqfx5GylplXVB54oCnjWxfQ427lGDJYMWiX9SjTRVeSHh3d3FxcXV5da3g/GxoYXFBY2+O/K+TWXBvbrSKRIdqCI5iGUtuwSBDqTRjNJ1yK6DT/x9AniH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU1NzcyLCAyMDE0LzAxLzEzLTE5OjQ0OjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0NGQjU0QjU1REFDMTFFODk1QTNBNTcyM0M0MTREMDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0NGQjU0QjY1REFDMTFFODk1QTNBNTcyM0M0MTREMDIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQ0ZCNTRCMzVEQUMxMUU4OTVBM0E1NzIzQzQxNEQwMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQ0ZCNTRCNDVEQUMxMUU4OTVBM0E1NzIzQzQxNEQwMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAAgABsAAAj/ADUJHEiwYEEJg6ZMGSTBoMOHBKkhesYBWioVrNw8nOQujg4NOu68kECGYDEue+h8ubQnS5sKfgpuwaMjgDtJSqBc0ACFyEA/KUqYonTpCx1pKfpN0ThQSbY79oD4oNLDhzwNAWKUHBakC7sslChxWJciSIIQAyFouBDgDhBML3zs1JANjx8JiMCB69KFS5QaNaIEEYVAoJALcS6wDRAglpRMMBxICRBiWYkPuXDhUvOhM4FpYBht0YRAQ+ILOqQ46GBExK9m1YBN6YOr86bbnTwT6CdJ4zuQceJIqdSMz4PjkfIAYjTlCAE10KMT8EThm6QWmuKA/AioUp5I4PNU/xKBwpGTI548EVg/3ZMhQ6KojKargW4HCyLy57ewCBCQPq+8R8GAFLyHwRXoFKaJDtlkY18ai1gg4SJppOGAI6Dcg8GGGBjC4QMu2AOBQHc00GA2KBih4opGdJAMFW5Ec8VxND7Axw5WjCTQC9k04KMDgghCwpAkCAIDMD1oMkcbV/DgJA9XsJGPPBCMpokf8Pj4IwzcdMkNDGK4A0EvpQgTxg5o7uAKPmf0wJQmZMQARY8+EgPDnWAaU0YwIywwxDn1BGHNSznkoAV2BGmDgAAyYCNGJpCO4kUENJhgQy0L2DLDpt4AsAAhgWgRA0F+nLKLGf8kMY8sSfxgjhxyFP8yDieZQgIJC+kMYcMhOOSAyps/bIAEAx6AcMsEyA7gAQN2FOLMI62wwIICAHBiQxE4ZJBDlZoUgEU4w9JjxgD+lKssEkzoMgshAKywwgiP7NqIJQcYwIgE2uhzwxpMhAsCLE88YYYdTCRyAzLqBHINM0Mcos68B9BiwCohKIPGDXok0i+xIMTzBBpMjLGGLsdkC8AIjTSCA720vGHAGRAUoMgSN/yRyBj9yjGAODeM8ccNEbQTSDd1dHPAARlk8IbLdcATgsxY0KzHGjePsYEif+ixRARelMOLKvycIPbYJ/hSDh4SCBHKPhGQE7UucGPxyT9VeAHFCxDEMAcEkyA00MPffzcRAnZkzEEKHAIkrrgAcLyFAATaWLnFFi1UbrmVA7UgxBxEhOD5HHPEoA2iEDkUEAA7"></div><div class="hint"><span>你好 ePass Token！</span><span>现在需要验证你的用户PIN码。</span></div></div><div class="middle"><span>用户PIN:</span><input class="pin" type="password" autocomplete="off"></div><div class="bottom"><label><input class="check" type="checkbox" autocomplete="off"><span>使用软键盘</span></label></div><div class="softkey"></div></div><div class="utc_btn"><button class="change">修改PIN</button><button class="sure none" disabled>确定</button><button class="close">关闭</button></div></div>';
		node.innerHTML=divbox;
		if(document.querySelectorAll('.utc_popupbox.feitianpin').length==0){
			document.body.appendChild(node);
			_s.fadeIn(document.querySelector('.utc_popupbox.feitianpin'));
			document.querySelector('.utc_popupbox.feitianpin .pin').focus();
			_s.eventbox();
		};
		_s.softkey=new UTC_Ui_Softkey();
		_s.softkey.inputtext='.utc_popupbox.feitianpin .pin';
		_s.softkey.show('.utc_popupbox.feitianpin .softkey');
		_s.softkey.input=function(){
			_s.ifsure(document.querySelector('.utc_popupbox.feitianpin .pin').value);
		};
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.feitianpin'),function(){
			document.querySelector('.utc_popupbox.feitianpin').parentNode.removeChild(document.querySelector('.utc_popupbox.feitianpin'));
		});
	};
	_s.sure=function(){
		_s.json.success(document.querySelector('.utc_popupbox.feitianpin .pin').value);
		_s.close();
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.ifsure=function(text){
		if(text!=''){
			_s.removeClass(document.querySelector('.utc_popupbox.feitianpin .sure'),'none');
			document.querySelector('.utc_popupbox.feitianpin .sure').removeAttribute('disabled');
		}else{
			_s.addClass(document.querySelector('.utc_popupbox.feitianpin .sure'),'none');
			document.querySelector('.utc_popupbox.feitianpin .sure').setAttribute('disabled',true);
		};
	};
	_s.eventbox=function(){
		if(document.addEventListener){
			document.querySelectorAll('.utc_popupbox.feitianpin .close')[0].addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelectorAll('.utc_popupbox.feitianpin .close')[1].addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.feitianpin .sure').addEventListener('click', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.feitianpin .pin').addEventListener('keyup', function(e){
				if((e.which==13)&&document.querySelector('.utc_popupbox.feitianpin .sure').getAttribute('disabled')==null){
					_s.eventboxfun2();
				};
				var _this=this;
				_s.eventboxfun3(_this);
			});
			document.querySelector('.utc_popupbox.feitianpin .check').addEventListener('change', function(){
				if(document.querySelector('.utc_popupbox.feitianpin .check').checked){
					_s.addClass(document.querySelector('.utc_popupbox.feitianpin'),'softkey');
				}else{
					_s.removeClass(document.querySelector('.utc_popupbox.feitianpin'),'softkey');
				};
			});
			document.querySelector('.utc_popupbox.feitianpin .change').addEventListener('click', function(){
				UTCMiddleWare.Ui.Ui_ChangePin.show();
			});
		}else{
			document.querySelectorAll('.utc_popupbox.feitianpin .close')[0].attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelectorAll('.utc_popupbox.feitianpin .close')[1].attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.feitianpin .sure').attachEvent('onclick', function(){
				_s.eventboxfun2();
			});
			document.querySelector('.utc_popupbox.feitianpin .pin').attachEvent('onkeyup', function(e){
				e=e||window.event;
	            var _this=e.srcElement||e.target;
	            _s.eventboxfun3(_this);
			});
			document.querySelector('.utc_popupbox.feitianpin .check').attachEvent('onchange', function(){
				if(document.querySelector('.utc_popupbox.feitianpin .check').checked){
					_s.addClass(document.querySelector('.utc_popupbox.feitianpin'),'softkey');
				}else{
					_s.removeClass(document.querySelector('.utc_popupbox.feitianpin'),'softkey');
				};
			});
		};
	};
	_s.eventboxfun1=function(){
		_s.close();
	};
	_s.eventboxfun2=function(){
		_s.sure();
	};
	_s.eventboxfun3=function(_this){
		_s.ifsure(_this.value);
	};
	_s.initialize=function(){
	};
	_s.initialize();
};
//改密码
function UTCMiddleWare_Ui_ChangePin(){
	var s=UTCMiddleWare;
	var _s=this;
	_s.show=function(json){
		_s.json=json;
		var node=document.createElement("div");
		_s.addClass(node,'utc_popupbox');
		_s.addClass(node,'changepin');
		var divbox='<div class="utc_popupbg"></div><div class="utc_popup"><div class="utc_title">修改用户PIN码<button class="close">X</button></div><div class="utc_con"><div class="inputbox"><span>请输入旧PIN码:</span><input class="oldpin" type="password"></div><div class="inputbox"><span>请输入新的PIN码(2 到 10000 字符):</span><input class="newpin" type="password"></div><div class="inputbox"><span>确认新的PIN码:</span><input class="relpin" type="password"></div><div class="hint"></div></div><div class="utc_btn"><button class="sure">确定</button><button class="close">关闭</button></div></div>';
		node.innerHTML=divbox;
		if(document.querySelectorAll('.utc_popupbox.changepin').length==0){
			document.body.appendChild(node);
			_s.fadeIn(document.querySelector('.utc_popupbox.changepin'));
			_s.eventbox();
		};
	};
	_s.close=function(){
		_s.fadeOut(document.querySelector('.utc_popupbox.changepin'),function(){
			document.querySelector('.utc_popupbox.changepin').parentNode.removeChild(document.querySelector('.utc_popupbox.changepin'));
		});
	};
	_s.errormsg=function(msg){
		document.querySelector('.utc_popupbox.changepin .hint').innerHTML=msg;
	};
	_s.sure=function(){
		var oldpin=document.querySelector('.utc_popupbox.changepin .oldpin').value;
		var newpin=document.querySelector('.utc_popupbox.changepin .newpin').value;
		var relpin=document.querySelector('.utc_popupbox.changepin .relpin').value;
		if(oldpin==''){
			document.querySelector('.utc_popupbox.changepin .hint').innerHTML='请输入旧PIN码！';
		}else{
			UTCMiddleWare.OpenKey({
				pin:oldpin,
				success:function(){
					if(newpin==''){
						document.querySelector('.utc_popupbox.changepin .hint').innerHTML='请输入新PIN码！';
					}else{
						if(relpin==''){
							document.querySelector('.utc_popupbox.changepin .hint').innerHTML='请确认新PIN码！';
						}else{
							if(newpin!=relpin){
								document.querySelector('.utc_popupbox.changepin .hint').innerHTML='新PIN码两次输入不一致！';
							}else{
								UTCMiddleWare.ChangePin({
									oldpin:oldpin,
									newpin:newpin,
									success:function(){
										document.querySelector('.utc_popupbox.changepin .hint').innerHTML='修改成功 ！';
									},fail:_s.errormsg,error:_s.errormsg
								});
							}
						}
					}
				},fail:_s.errormsg,error:_s.errormsg
			});
		};
	};
	_s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	_s.addClass=function(obj, cls) {
	    if (!_s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	_s.removeClass=function(obj, cls) {
	    if (_s.hasClass(obj, cls)) {
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	        obj.className = obj.className.replace(reg, ' ');
	    };
	};
	_s.fadeIn=function(el,callback){
		try{
		  el.style.opacity = 0;
		  var last = +new Date();
		  var tick = function() {
		    el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		    last = +new Date();
		    if (+el.style.opacity < 1) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.fadeOut=function(el,callback){
		try{
		  el.style.opacity = 1;
		  var last = new Date();
		  var tick = function() {
		    el.style.opacity = el.style.opacity - (new Date() - last) / 400;
		    last = new Date();
		    if (el.style.opacity > 0) {
		      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
		    }else{
		    	try{callback();}catch(e){};
		    }
		  };
		  tick()
		}catch(e){};
	};
	_s.eventbox=function(){
		if(document.addEventListener){
			document.querySelectorAll('.utc_popupbox.changepin .close')[0].addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelectorAll('.utc_popupbox.changepin .close')[1].addEventListener('click', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.changepin .sure').addEventListener('click', function(){
				_s.eventboxfun2();
			});
		}else{
			document.querySelectorAll('.utc_popupbox.changepin .close')[0].attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelectorAll('.utc_popupbox.changepin .close')[1].attachEvent('onclick', function(){
				_s.eventboxfun1();
			});
			document.querySelector('.utc_popupbox.changepin .sure').attachEvent('onclick', function(){
				_s.eventboxfun2();
			});
		};
	};
	_s.eventboxfun1=function(){
		_s.close();
	};
	_s.eventboxfun2=function(){
		_s.sure();
	};
	_s.initialize=function(){
	};
	_s.initialize();
};
function UTC_Ui_Softkey(){
	var s=this;
	s.ele=null;
	s.lowercase=true;
	s.inputtext=='';
	s.show=function(ele){
		s.lowercase=true;
		document.querySelector(ele).innerHTML='';
		document.querySelector(ele).appendChild(s.ele);
	};
	s.hide=function(ele){
		s.ele.parentNode.removeChild(s.ele);
	};
	s.hasClass=function(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
	};
	s.addClass=function(obj, cls) {
	    if (!s.hasClass(obj, cls)) {
		    obj.className += " " + cls;
	    };
	};
	s.event=function(){
		if(document.addEventListener){
			for(var i=0;i<s.ele.querySelectorAll('button.input').length;i++){
				s.ele.querySelectorAll('button.input')[i].addEventListener('click', function(e){
					var _this=this;
					s.eventbuttoninput(_this);
				});
			};
			s.ele.querySelector('button.backspace').addEventListener('click', function(){
				s.eventbuttonbackspace();
			});
			s.ele.querySelector('button.enter').addEventListener('click', function(){
				s.eventbuttonenter();
			});
			s.ele.querySelector('button.shift').addEventListener('click', function(e){
				var _this=this;
				s.eventbuttonshift(_this);
			});
		}else{
			for(var i=0;i<s.ele.querySelectorAll('button.input').length;i++){
				s.ele.querySelectorAll('button.input')[i].attachEvent('onclick', function(e){
					e=e||window.event;
		            var _this=e.srcElement||e.target;
					s.eventbuttoninput(_this);
				});
			};
			s.ele.querySelector('button.backspace').attachEvent('onclick', function(){
				s.eventbuttonbackspace();
			});
			s.ele.querySelector('button.enter').attachEvent('onclick', function(){
				s.eventbuttonenter();
			});
			s.ele.querySelector('button.shift').attachEvent('onclick', function(e){
				e=e||window.event;
	            var _this=e.srcElement||e.target;
				s.eventbuttonshift(_this);
			});
		};
	};
	s.eventbuttoninput=function(_this){
		document.querySelector(s.inputtext).value+=_this.innerText;
		try{s.input();}catch(e){};
	};
	s.eventbuttonbackspace=function(){
		var longnum=document.querySelector(s.inputtext).value.length;
		var num;
		num=document.querySelector(s.inputtext).value.substr(0,longnum-1);
		document.querySelector(s.inputtext).value=num;
		try{s.input();}catch(e){};
	};
	s.eventbuttonenter=function(){
		if(document.querySelector(s.inputtext).type=='text'){
		}else{
			document.querySelector(s.inputtext).value+='\r\n';
		};
	};
	s.eventbuttonshift=function(_this){
		if(s.lowercase){
			_this.innerHTML='切换为小写';
			s.lowercase=false;
			for(var i=0;i<s.ele.querySelectorAll('button.input').length;i++){
				s.ele.querySelectorAll('button.input')[i].innerHTML=s.ele.querySelectorAll('button.input')[i].innerHTML.toUpperCase();
			};
		}else{
			_this.innerHTML='切换为大写';
			s.lowercase=true;
			for(var i=0;i<s.ele.querySelectorAll('button.input').length;i++){
				s.ele.querySelectorAll('button.input')[i].innerHTML=s.ele.querySelectorAll('button.input')[i].innerHTML.toLowerCase();
			};
		};
	};
	s.init=function(){
		s.ele=document.createElement('table');
		s.ele.innerHTML='<tr><td><button class="input">1</button></td><td><button class="input">2</button></td><td><button class="input">3</button></td><td><button class="input">4</button></td><td><button class="input">5</button></td><td><button class="input">6</button></td><td><button class="input">7</button></td><td><button class="input">8</button></td><td><button class="input">9</button></td><td><button class="input">0</button></td><td><button class="input">-</button></td><td><button class="input">=</button></td><td><button class="input">`</button></td><td><button class="input">~</button></td><td colspan="2"><button class="backspace">退格</button></td></tr><tr><td><button class="input">q</button></td><td><button class="input">w</button></td><td><button class="input">e</button></td><td><button class="input">r</button></td><td><button class="input">t</button></td><td><button class="input">y</button></td><td><button class="input">u</button></td><td><button class="input">i</button></td><td><button class="input">o</button></td><td><button class="input">p</button></td><td><button class="input">[</button></td><td><button class="input">]</button></td><td><button class="input">{</button></td><td><button class="input">}</button></td><td><button class="input">\\</button></td><td><button class="input">|</button></td></tr><tr><td><button class="input">a</button></td><td><button class="input">s</button></td><td><button class="input">d</button></td><td><button class="input">f</button></td><td><button class="input">g</button></td><td><button class="input">h</button></td><td><button class="input">j</button></td><td><button class="input">k</button></td><td><button class="input">l</button></td><td><button class="input">;</button></td><td><button class="input">\'</button></td><td><button class="input">:</button></td><td><button class="input">"</button></td><td colspan="3" rowspan="2"><button class="enter">回车</button></td></tr><tr><td><button class="input">z</button></td><td><button class="input">x</button></td><td><button class="input">c</button></td><td><button class="input">v</button></td><td><button class="input">b</button></td><td><button class="input">n</button></td><td><button class="input">m</button></td><td><button class="input">,</button></td><td><button class="input">.</button></td><td><button class="input">/</button></td><td><button class="input"><</button></td><td><button class="input">></button></td><td><button class="input">?</button></td></tr><tr><td><button class="input">!</button></td><td><button class="input">@</button></td><td><button class="input">#</button></td><td><button class="input">$</button></td><td><button class="input">%</button></td><td><button class="input">^</button></td><td><button class="input">&</button></td><td><button class="input">*</button></td><td><button class="input">(</button></td><td><button class="input">)</button></td><td><button class="input">_</button></td><td><button class="input">+</button></td><td colspan="4"><button class="shift">切换为大写</button></td></tr><tr></tr>';
		s.addClass(s.ele,'UTC_Softkey');
		s.event();
	};
	s.init();
};

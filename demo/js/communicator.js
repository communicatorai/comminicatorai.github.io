function SJ(node){this.element = node;}
SJ.prototype.show = function(){ this.element.style.display = 'block';}
SJ.prototype.hide = function(){ this.element.style.display = 'none';}
SJ.prototype.append = function(node){ this.element.appendChild(node)};
SJ.prototype.html = function(value){ if(value){this.element.innerHTML = value;}else{ return this.element.innerHTML;}}
SJ.prototype.val = function(v){ if(v){ this.element.value = v}else{ return this.element.value;} }
function J(qString){
	this.elements = [];
	if(qString.indexOf(".")===0){
	    var className = qString.substring(1,qString.length);
	    this.elements = [];
	    var elts = document.getElementsByClassName(className);
	    for(i=0;i<elts.length;i++){
		this.elements.push(new SJ(elts[i]));
	    }
	}else if(qString.indexOf("#")===0){
	    var idName = qString.substring(1,qString.length)
	    this.elements = [];
	    var elts = [document.getElementById(idName)];
	    for(i=0;i<elts.length;i++){
		this.elements.push(new SJ(elts[i]));
	    }
	}
}

J.prototype.show = function(){
    this.elements.forEach((e)=>e.show());
}
J.prototype.hide = function(){
    this.elements.forEach((e)=>e.hide());
}
J.prototype.val = function(v){
    return this.elements.map((e)=>{ return e.val(v); });
}
J.prototype.html = function(value){
    return this.elements.map((e)=>{ return e.html(value);});
}
J.prototype.append = function(node){
    this.elements.forEach((e)=>e.append(node));
}
J.prototype.on = function(){}
J.prototype.click = function(){}
J.ajax = function(option){}

function CommService(){
    this.rootURL = "https://communicatorai.herokuapp.com";
	this.baseURL = this.rootURL + "/bot/3";
	this.state = {
		"action": "start"
	};
	this.initialized = false;
	this.onreceive = function(){console.log("New state received");}
}

CommService.prototype._send = function(data,cb){
	var settings = {
		"async": true,
  		"url": this.baseURL,
  		"method": "POST",
  		"headers": {
    		"Content-Type": "application/json"
    	},
    	"data": JSON.stringify(data)
	};
	var self = this;
    $.ajax(settings).done(function(e){ self.done(e); if(cb){cb(e)}});
}

CommService.prototype.init = function(){
	if(this.initialized){
		return;
	}
	var data ={
		"state" :{
			"action": "start"
		}
	};
	this.initialized = true;
	this._send(data);
}
CommService.prototype.send = function(msg,cb){
	if(!msg || msg.trim() === ""){
		return;
	}
	var data ={
		"input": msg,
		"state" :this.state
	};
    this._send(data,cb);
}
CommService.prototype._upload = function(file, signedRequest, url, callback){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
	if(xhr.status === 200){
	    callback(url);
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}

CommService.prototype._getSignedRequest = function(file,callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.rootURL + `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        this._upload(file, response.signedRequest, response.url,callback);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

CommService.prototype.uploadFile = function(file,callback){
    this._getSignedRequest(file,callback);
}

CommService.prototype.done = function(response){
	if(!response){ console.error("Unable to get response from bot ");return; }
	window.communicator.commservice.state = response.response.state;
	var state = response.response.state;
	window.communicator.chatrenderer.render(state.chatbox,state.options);
}
CommService.prototype.getState = function(){
	return this.state;
}


var mediumBotHtml ='<div class="init card fadeIn animated bounce delay-1s shadow">'
          + '<p ><strong style="padding-bottom:4px" >Hey Jobseeker</strong> 🖐, I am Jobeye AI <br>What sort of domain do you have experience in ?</p>'
        	+'</div>'
        +'<div class="init agentInput fadeIn animated bounce 800ms shadow">'
        +'<input class="messageBox" type="text" name="" value="" placeholder="Type Message here">'
        +'<div class="optionBox"></div>'
    +'<div class="fileBox"><input type="file" name="file" id="file-input"></input></div>'
    + '<div class="uploadingBox">Uploading file..</div>'
    + '<div class="sendingBox"> Sending.. </div>'
        +'<button class="sendBtn" type="button" name="button" >Send Message</button>'
        +'</div>';

var agentIcon =  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" width="4em" height="4em"><g data-name="Group 4"><g data-name="Group 3" transform="translate(-18.5 -45.5)" fill="#2680eb"><circle data-name="Ellipse 2" cx="25.5" cy="25.5" r="25.5" transform="translate(18.5 45.5)"/><path data-name="Path 2" d="M51.544 90.519l14.173 4.872a2.233 2.233 0 0 0 2.59-3.092l-6.233-14.138a1.97 1.97 0 0 0-3.364-.425l-7.94 9.265a2.2 2.2 0 0 0 .774 3.518z"/></g><path data-name="Path 1" d="M37.995 28.998a13.3 13.3 0 0 1-25.5 0" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="5"/></g></svg>';

var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" width="4em" height="4em"><path data-name="Path 3" stroke="#707070" d="M1.5 1.5l8 8 8-8" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" opacity=".27"/></svg>';

var smallBotHtml = '<div class="communicatorChatBox shadow">'
      + '<div class="communicatorAgent">'
      + mediumBotHtml
      + '</div>'
      +  '<div class="chatBody fadeIn animated bounce delay-1s ">'
      + '<div class="aiReply">'
      +    '<span class="chatTime">Jobeye Agent | 1:13 PM</span>'
      +    '<p><strong style="padding-bottom:4px">Hey Jobseeker</strong> 🖐, I am Jobeye AI <br>What sort of domain do you have experience in ?</p>'
      +  '</div>'
    + '</div>'
    +'<div class="branding fadeIn animated bounce delay-1s"><a target="_blank" href="http://communicator.ai/">⚡️ by Communicator AI</a></div>'
      +'</div>';


function ChatRenderer(){
	this.rendered = {};
}

ChatRenderer.prototype.init = function(){
    $(".fileBox").hide();
    $(".sendingBox").hide();
    window.communicator.chatrenderer.hideSending();
}

ChatRenderer.prototype.getChatDate = function(){
	return (new Date()).toLocaleTimeString();
}
ChatRenderer.prototype.getBotChat= function(chat){
	var div = document.createElement('div');
	div.className = "aiReply";
    var iH = '<span class="chatTime">Communicator Bot | '+this.getChatDate()+'</span>';
    iH = iH + '<p >'+chat.message+'</p>';
    div.innerHTML = iH;
    return div;
}
ChatRenderer.prototype.getUserChat = function(chat){
	var div = document.createElement('div');
	div.className = "userReply";
    var iH = '<span class="chatTime">You.  | '+this.getChatDate()+'</span>';
    iH = iH + '<p >'+chat.message+'</p>';
    div.innerHTML = iH;
    return div;
}
ChatRenderer.prototype.appendBotText = function(chat){
	if(chat.message !== ""){
		$(".chatBody").append(this.getBotChat({"message":chat.message,"name":chat.author.name}));
		var objDiv = $(".chatBody")[0];
		objDiv.scrollTop = objDiv.scrollHeight;
	}
}
ChatRenderer.prototype.appendUserText = function(chat){
	if(chat.message !== ""){
		$(".chatBody").append(this.getUserChat({"message":chat.message,"name":chat.author.name}));
		$(".messageBox").val("");
		var objDiv = $(".chatBody")[0];
		objDiv.scrollTop = objDiv.scrollHeight;
	}
}
ChatRenderer.prototype.appendChat = function(msg){
	if(msg.author.name === "Jay"){
		this.appendBotText(msg);
	}else{
		this.appendUserText(msg);
	}
}

ChatRenderer.prototype.showSending = function(){
    $(".messageBox").hide();
    $(".sendBtn").hide();
    $(".sendingBox").show();
}

ChatRenderer.prototype.hideSending = function(){
    $(".messageBox").show();
    $(".sendBtn").show();
    $(".sendingBox").hide();
}
ChatRenderer.prototype.getOption = function(option){
	l = document.createElement('li');
	l.innerText = option;
	l.setAttribute('value',option);
    l.onclick = function(e){
	$(".optionBox").html('');
	// Clear options
	window.communicator.chatrenderer.showSending();
	window.communicator.commservice.send(e.target.getAttribute("value"),function(){
	    window.communicator.chatrenderer.hideSending();
	});
    }
	return l;
}

function initFileBox(){
    document.getElementById("file-input").onchange = () => {
	const files = document.getElementById('file-input').files;
	const file = files[0];
	if(file == null){
	    return alert('No file selected.');
	}
	// Show uploading symbol
	$(".uploadingBox").show();
	$(".fileBox").hide();
	window.communicator.commservice.uploadFile(file,function(url){
	    document.getElementById("file-input").onchange = () => {};
	    $(".messageBox").val(url);
	    $(".messageBox").show();
	    // Hide uploading symbol
	    window.communicator.commservice.send($(".messageBox").val().trim());
	});
  };

}

ChatRenderer.prototype.renderInput = function(options,msg){
	$(".optionBox").hide();
        $(".optionBox").html('');
    $(".uploadingBox").hide();
	$(".messageBox").show();
	$(".fileBox").hide();
	if(msg.type === 'file'){
	    $(".messageBox").hide();
	    $(".fileBox").show();
	    initFileBox();
	}else if(options && options.length>0){
		$(".optionBox").html('');
		var list = document.createElement('ul');
		options.map((option)=>{
			return this.getOption(option);
		}).forEach((ch)=>{
			list.append(ch);
		})
		$(".optionBox").append(list);
		$(".optionBox").show();
		$(".messageBox").hide();
	}
}
ChatRenderer.prototype.render = function(chatbox,options){
	chatbox.map((msg)=>{
		return {
			id: msg.timestamp,
			msg: msg
		}
	}).filter((msg)=>{
		return !this.rendered[msg.id]
	}).forEach((msg)=>{
		this.rendered[msg.id] = "1";
		this.appendChat(msg.msg);
	});
	this.renderInput(options,chatbox[chatbox.length-1]);

}

function ChatSmallBox(){

}

ChatSmallBox.prototype.init = function(){
    window.communicator.smallbox.render();
    this.hide();
    $(".fileBox").hide();
    $(".uploadingBox").hide();
    window.communicator.smallbox.setOnClick();
}

ChatSmallBox.prototype.setOnClick = function(){
	$('.communicatorChatBox').on('click',function(){
		$('.communicatorAgent').addClass('open');
	});
	$('.optionBox').hide();
	$('.agentInput').click(function() {
            $('.communicatorChatBox').addClass('expand');
            $('.agentInput').removeClass('shadow');
            $('.card').addClass('chat');
            $('.communicatorAgent').addClass('expand');
            $('.chatBody').css('display','block');
            $('.card').css('display','none');
            $('.chatClose').css('display','block');
		window.communicator.commservice.init();
	});
        $(".sendBtn").click(function(){
	    window.communicator.chatrenderer.showSending();
	    window.communicator.commservice.send($(".messageBox").val().trim(),function(){
		window.communicator.chatrenderer.hideSending();
	    });
	})
	$(".messageBox").on('keydown',function(e){
		if(e.key === "Enter"){
		    window.communicator.chatrenderer.showSending();
		    window.communicator.commservice.send($(".messageBox").val().trim(),function(){
			window.communicator.chatrenderer.hideSending();
		    });
		}
	})
}

ChatSmallBox.prototype.render = function() {
	var di = document.createElement('div');
	di.innerHTML = smallBotHtml;
	document.getElementsByTagName('body')[0].appendChild(di.firstChild);
};
ChatSmallBox.prototype.show = function() {
    this.visible = true;
    $(".communicatorChatBox").show();
    $('.communicatorAgent').addClass('open');
}
ChatSmallBox.prototype.hide = function() {
    this.visible = false;
    $(".communicatorChatBox").hide();
}
ChatSmallBox.prototype.toggle = function(){
    if(this.visible){
	this.hide();
    }else{
	this.show();
    }
}

function AgentIcon(){
    this.smallBoxOpen = false;
}

AgentIcon.prototype.init = function(){
    this.render();
    this.hide();
    $(".AgentIconNew").on('click',function(){
	window.communicator.smallbox.toggle();
    });
}
AgentIcon.prototype.render = function(){
    var aIcon = document.createElement('div');
    aIcon.className = "AgentIconNew";
    aIcon.innerHTML = agentIcon;
    document.getElementsByTagName('body')[0].appendChild(aIcon);
}
AgentIcon.prototype.show = function(){
    $(".AgentIconNew").show();
}
AgentIcon.prototype.hide = function(){
    $(".AgentIconNew").hide();
}
function start(){
    window.communicator = {};
    window.communicator.agentIcon = new AgentIcon();
    window.communicator.agentIcon.init();
    window.communicator.agentIcon.show();
    window.communicator.smallbox = new ChatSmallBox();
    window.communicator.smallbox.init();
    window.communicator.chatrenderer = new ChatRenderer();
    window.communicator.chatrenderer.init();
    window.communicator.commservice = new CommService();
}

window.onload = start;

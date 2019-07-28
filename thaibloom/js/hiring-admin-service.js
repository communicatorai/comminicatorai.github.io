var hiringService = function(){
    this.rootURL = "http://localhost:3001";
    if(window.origin === "http://communicator.ai"){
	this.rootURL = "http://communicatorai.herokuapp.com";
    }
    this.lastUpdated = null;
    this.cron = null;
    this.syncInProgress = false;

    this._call = function(){
	this.syncInProgress = true;
	var baseURL = this.rootURL + '/candidates';
	var key = "hiring";
	var data_json = {};//this._get(key);
	var settings = {
		"async": true,
  		"url": baseURL,
  		"method": "GET",
  		"headers": {
    		    "Content-Type": "application/json"
    		},
    	    "data": data_json
	};
	var self = this;
	$.ajax(settings).done(function(e){
	    var uData = e.data.map((d)=>{
		return JSON.parse(d);
	    })
	    localStorage.setItem(key,JSON.stringify(uData));
	});
	// Call the API
	this.syncInProgress = false;
	this.lastUpdated = new Date();
    }
    this._sync = function(){
	var now = new Date();
	var UPDATE_INTERVAL = 30000; // 1 sec
	if(this.lastUpdated){
	    if((now.getTime()-this.lastUpdated.getTime())>UPDATE_INTERVAL){
		this._call();
	    }
	}else{
	    this._call();
	}
    }

    // Force sync
    this.refresh = function(){
	this._call();
    }

    this.start = function(){
	var UPDATE_INTERVAL = 30000;
	this.cron = setInterval(()=>{
	    this._sync();
	},UPDATE_INTERVAL);
    }

    this.stop = function(){
        if(!this.cron){
	    return;
        }
        clearInterval(this.cron);
    }


        this._set = function(key,value){
	    // if call in progress
	    //
	    localStorage.setItem(key,JSON.stringify(value));
	}

	this._get = function(key){
	    var l = localStorage.getItem(key);
	    if(l==null || l === ""){ return [];}
	    return JSON.parse(l);
	}

	this._list = function(key){
	    return this._get(key);
	}

    this._getOne = function(key,id){
	return this._get(key).filter((or)=>{
	    return or.id.toString() === id.toString();
	}).pop();
    }

       this._add = function(key,item){
           // This call needs to be atomic
	   while(this.syncInProgress){}
	    var o = this._get(key);
	    o.push(item);
	    this._set(key,o);
	}

        this._edit = function(key,item){
	    // This call needs to be atomic
	    // Wait util _call is done
	    var found = false;
	    while(this.syncInProgress){}
	    var o = this._get(key).map((or)=>{
		if(or.id.toString() === item.id.toString()){
		    found = true;
		    return item;
		}else{
		    return or;
		}
	    });
	    if(!found){ o.push(item);}
	    this._set(key,o);
	}

	this._delete = function(key,item){
	    var o = this._get(key).filter((or)=>{
		return item.id.toString() !== or.id.toString();
	    });
	    this._set(key,o);
	}

	this.getJDs = function(){
	    return this._list("jd");
	}

	this.addJD = function(jd){
	    return this._add("jd",jd);
	}

	this.editJD = function(jd){
	    return this._edit("jd",jd);
	}

	this.deleteJD = function(jd){
	    return this._delete("jd",jd);
	}

	this.getCandidates = function(){
	    return this._list("hiring");
	}
	this.addCandidate = function(candidate){
	    return this._add("hiring",candidate);
	}
	this.editCandidate = function(candidate){
	    return this._edit("hiring",candidate);
	}
	this.deleteCandidate = function(candidate){
	    return this._delete("hiring",candidate);
	}

	this.getUsers = function(){
	    return this._list("users");
	}

	this.addUser = function(user){
	    return this._add("users",user);
	}

	this.editUser = function(user){
	    return this._edit("users",user);
	}

	this.deleteUser = function(user){
	    return this._delete("users",user);
	}
}

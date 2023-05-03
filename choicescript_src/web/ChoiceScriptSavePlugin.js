Scene.prototype.sm_save=function(line){var stack=this.tokenizeExpr(line);if(stack.length>2)throw new Error("sm_save: Invalid number of arguments, expected 0, 1 (save name) or 2 (id).");ChoiceScriptSavePlugin._save((new Date).getTime(),stack.length==1?this.evaluateExpr(stack):null)};Scene.prototype.sm_load=function(line){var stack=this.tokenizeExpr(line);var variable=this.evaluateExpr(stack);this.finished=true;this.skipFooter=true;this.screenEmpty=true;ChoiceScriptSavePlugin._load(variable)};Scene.prototype.sm_delete=function(line){var stack=this.tokenizeExpr(line);if(stack.length!=1)throw new Error("sm_delete: Invalid number of arguments, expected 1.");ChoiceScriptSavePlugin._delete(this.evaluateExpr(stack))};Scene.prototype.sm_update=function(){if(typeof this.stats._sm_save_count==="undefined")this.stats._sm_save_count=0;ChoiceScriptSavePlugin._getSaveList(function(saveList){if(!saveList)return;ChoiceScriptSavePlugin._syncHelperVariables(saveList,function(){})})};Scene.prototype.sm_menu=function(data){data=data||"";data=data.toLowerCase();var selectEle=document.getElementById("quickSaveMenu");if(!selectEle)return;var active=false;if(data==="false"){active=false}else if(data==="true"){active=true}else if(!data){active=selectEle.style.display=="none"}else{throw new Error("*sm_menu: expected true, false (or nothing) as an argument!")}selectEle.style.display=active?"inline":"none";var btns=document.getElementsByClassName("savePluginBtn");for(var i=0;i<btns.length;i++){btns[i].style.display=active?"inline":"none"}};Scene.validCommands["sm_save"]=1;Scene.validCommands["sm_load"]=1;Scene.validCommands["sm_delete"]=1;Scene.validCommands["sm_update"]=1;Scene.validCommands["sm_menu"]=1;var ChoiceScriptSavePlugin={};ChoiceScriptSavePlugin._CSS="#quickSaveMenu {        margin: 5px;        width: 100px;    }";ChoiceScriptSavePlugin._save=function(saveId,saveName){restoreObject(initStore(),"state",null,function(baseSave){if(baseSave){baseSave.stats["_smSaveName"]=saveName||"";baseSave.stats["_smSaveDateId"]=saveId;ChoiceScriptSavePlugin._addToSaveList(saveId,function(success){if(!success)return;saveCookie(function(){},ChoiceScriptSavePlugin._formatSlotName(saveId),baseSave.stats,baseSave.temps,baseSave.lineNum,baseSave.indent,this.debugMode,this.nav);setTimeout(function(){var selectEle=document.getElementById("quickSaveMenu");if(selectEle){selectEle.innerHTML="";ChoiceScriptSavePlugin._populateSaveMenu(selectEle)}},3e3)})}else{}})};ChoiceScriptSavePlugin._formatSlotName=function(saveId){return window.storeName+"_SAVE_"+saveId};ChoiceScriptSavePlugin._load=function(saveId){clearScreen(loadAndRestoreGame.bind(stats.scene,ChoiceScriptSavePlugin._formatSlotName(saveId)))};ChoiceScriptSavePlugin._delete=function(saveId){ChoiceScriptSavePlugin._removeFromSaveList(saveId,function(success){if(!success)return;var select=document.getElementById("quickSaveMenu");if(select){var deletedOption=select.options[select.selectedIndex];if(deletedOption)deletedOption.parentElement.removeChild(deletedOption)}initStore().remove("state"+ChoiceScriptSavePlugin._formatSlotName(saveId),function(success,val){})})};ChoiceScriptSavePlugin._createQuickSaveMenu=function(){var p=document.getElementById("menuButton");if(!p){alert("Error: unable to attach quick save menu");return}p=p.parentElement;var head=document.getElementsByTagName("head")[0];var style=document.createElement("style");style.innerHTML=ChoiceScriptSavePlugin._CSS;head.appendChild(style);var selectEle=document.createElement("select");selectEle.setAttribute("id","quickSaveMenu");p.appendChild(selectEle);var buttonArr=[{innerHTML:"New Save",clickFunc:"ChoiceScriptSavePlugin.save();"},{innerHTML:"Load",clickFunc:"ChoiceScriptSavePlugin.load();"},{innerHTML:"Delete",clickFunc:"ChoiceScriptSavePlugin.delete();"}];for(var i=0;i<buttonArr.length;i++){var btn=document.createElement("button");btn.innerHTML=buttonArr[i].innerHTML;btn.setAttribute("class","spacedLink savePluginBtn");btn.setAttribute("onclick",buttonArr[i].clickFunc);p.appendChild(btn)}return selectEle};ChoiceScriptSavePlugin._populateSaveMenu=function(selectEle){ChoiceScriptSavePlugin._getSaveList(function(saveList){if(!saveList)return;saveList.forEach(function(saveId){ChoiceScriptSavePlugin._getSaveData(saveId,function(saveData){if(!saveData){return}var option=document.createElement("option");option.setAttribute("value",saveData.stats._smSaveDateId);if(!saveData){option.innerHTML="Failed to load save."}else{var slotDesc=saveData.stats.sceneName+".txt ("+simpleDateTimeFormat(new Date(parseInt(saveData.stats._smSaveDateId)))+")";if(saveData.stats._smSaveName){slotDesc=saveData.stats._smSaveName+" &mdash; "+slotDesc}option.innerHTML=slotDesc}selectEle.appendChild(option)})})})};ChoiceScriptSavePlugin._getSaveData=function(saveId,callback){restoreObject(initStore(),"state"+ChoiceScriptSavePlugin._formatSlotName(saveId),null,function(saveData){if(saveData){callback(saveData)}else{callback(null)}})};ChoiceScriptSavePlugin._removeFromSaveList=function(saveId,callback){ChoiceScriptSavePlugin._getSaveList(function(saveList){if(!saveList)return;var index=saveList.indexOf(saveId.toString());if(index>-1)saveList.splice(index,1);initStore().set("save_list",saveList.join(" "),function(success,val){ChoiceScriptSavePlugin._syncHelperVariables(saveList,function(){callback(success)})})})};ChoiceScriptSavePlugin._addToSaveList=function(saveId,callback){ChoiceScriptSavePlugin._getSaveList(function(saveList){if(!saveList)return;saveList.push(saveId.toString());initStore().set("save_list",saveList.join(" "),function(success,val){ChoiceScriptSavePlugin._syncHelperVariables(saveList,function(){callback(success)})})})};ChoiceScriptSavePlugin._syncHelperVariables=function(saveList,callback){self.stats._sm_save_count=saveList.length;saveList.forEach(function(save,index){ChoiceScriptSavePlugin._getSaveData(save,function(saveData){if(saveData){self.stats["_sm_save_id_"+index]=save;self.stats["_sm_save_name_"+index]=saveData.stats._smSaveName||"";self.stats["_sm_save_date_"+index]=simpleDateTimeFormat(new Date(parseInt(save)))}})});callback()};ChoiceScriptSavePlugin._getSaveList=function(callback){initStore().get("save_list",function(success,val){if(!success)callback(null);if(!val)callback([]);else callback(saveList=val.split(" ").sort(function(a,b){return b-a}))})};ChoiceScriptSavePlugin._init=function(){if("file:"===window.location.protocol&&(typeof window.uploadedFiles==="undefined"&&typeof allScenes==="undefined")){setTimeout(ChoiceScriptSavePlugin._init,3e3);return}if(!window.storeName){Scene.validCommands["sm_save"]=0;Scene.validCommands["sm_load"]=0;Scene.validCommands["sm_delete"]=0;Scene.validCommands["sm_menu"]=0;Scene.validCommands["sm_menu"]=0;return alertify.error("Disabling ChoiceScript Save Plugin as there is no storeName detected. Please check your index.html.")}ChoiceScriptSavePlugin._populateSaveMenu(ChoiceScriptSavePlugin._createQuickSaveMenu())};ChoiceScriptSavePlugin.save=function(){if(stats.sceneName=="choicescript_stats"){alert("Error: Unable to save at this point.");return}var date=new Date;var message="What would you like to call this save?<br>Leaving this blank will result in a scene and date identifier.";alertify.prompt(message,function(e,saveName){if(e){ChoiceScriptSavePlugin._save(date.getTime(),saveName)}else{}},"Quick Save")};ChoiceScriptSavePlugin.delete=function(){var select=document.getElementById("quickSaveMenu");if(select.value<=0)return;var message="Delete save '"+select.options[select.selectedIndex].text+"'?<br>This cannot be undone!";alertify.confirm(message,function(result){if(!result){return}else{ChoiceScriptSavePlugin._delete(parseInt(select.value))}})};ChoiceScriptSavePlugin.load=function(){var select=document.getElementById("quickSaveMenu");if(select.value<=0)return;alertify.confirm("Are you sure you wish to load this save?<br>Current progress will be lost!",function(result){if(!result){return}else{ChoiceScriptSavePlugin._load(select.value)}})};setTimeout(ChoiceScriptSavePlugin._init,3e3);
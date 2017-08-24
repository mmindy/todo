var task = [];
// 추가
var STATE_P = "진행";  
var STATE_C = "완료";

var render = function () {
	var $list = $(".list");
	var html = "";
	var rowNum = task.length;

	if (rowNum > 0) {
		$list.html("");
		for(var i = 0; i < rowNum; i ++) {
			html = "<p data-id='"+task[i].id+"' data-state='"+task[i].state+"'>"+
				"<span class='chkbox'><input type='checkbox' class='stateCheck'/></span>"+
				"<span class='title'>"+task[i].title+"(ID: "+task[i].id+"/"+task[i].state+")"+"</span>"+
				"<span class='remove'>X</span>"+
				"</p>";

			$list.append(html);
		}
		$list.find("p[data-state='"+STATE_C+"']").addClass("done");
		$list.find("p[data-state='"+STATE_C+"'] .stateCheck").attr("checked", true);
	} else {
		$(".list").html("<p class='noData'>내역없음!</p>")
	}
};

var addTask = (function () {
	var id = 0;
	var taskRow;
	return function (title) {
		taskRow = {
			id : id++,
			title : title,
			state : STATE_P
		};
		task.push(taskRow);
		render();
		$(".form #title").val("");
	};
}());

var removeTask = function (id) {
	var ID = false;
	for (var i = 0 ; i < task.length ; i++){
		if( task[i].id === id) {
			ID = id;
			break;
		}
	}
	if (ID === false) {
		warning("removeTask: invalid id - " + id);
		return;
	}
	for(var i = 0; i < task.length; i ++) {
		if (task[i].id === ID) {
			task.splice(i, 1);
			break;
		}
	};
	render();
};

var changeState = function (id, state) {
	var ID = false;
	var STATE = false;
	for (var i = 0 ; i < task.length ; i++){
		if (task[i].id === id){
			ID = id;
			break;
		}
	}
	if (ID === false) {
		warning("changeState - id :" +id+" is invalid.");
		return;
	}
	if (state !== STATE_P && state !== STATE_C){
		warning("changeState - state :" +state+" is invalid.");
		return;
	} else {
		STATE = state;
		if (STATE === STATE_P) {
			STATE = STATE_C;
		} else {
			STATE = STATE_P;
		}
	}
	for(var i = 0; i < task.length; i ++) {
		if (task[i].id === ID) {
			task[i].state = STATE;
			break;
		}
	};

	render();
};

var listDisplay = function (state) {
	var $listElem = $(".list p");
	$listElem.show();
	if (state === STATE_P) {
		$listElem.filter("[data-state='"+STATE_C+"']").hide();
	} else if (state === STATE_C) {
		$listElem.filter("[data-state='"+STATE_P+"']").hide();
	}
};

function warning(text) {
	var $textArea = $(".toDo #warning");
	$textArea.text(text);
}


render();
$(".form .submit").on("click", function(){
	var title = $(".form").find("#title").val();
	addTask(title);
});

$(".toDo").on("click", ".list .chkBox , .list .title", function(){
	var thisID = $(this).parent().data("id");
	var thisState = $(this).parent().data("state");
	changeState(thisID, thisState);
});

$(".toDo").on("click", ".list .remove", function(){
	var $thisRow = $(this).parent("p");
	var thisID = $thisRow.data("id");
	removeTask(thisID);
});

$(".toDo").on("click", ".view li a", function(event){
	var thisState = $(this).attr("href");
	thisState = thisState.substr(1);
	event.preventDefault();

	$(".view li").removeClass("on");
	$(this).parent("li").addClass("on");

	switch (thisState){
		case "all" :
				listDisplay();
			break;
		case "ing" :
				listDisplay(STATE_P);
			break;
		case "end" :
				listDisplay(STATE_C);
			break;
		default :
				listDisplay();
			break;
	}

});

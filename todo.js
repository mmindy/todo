var task = [];
var id = 0;

var printList = function () {
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
				"</p>";  //state = 0 이 진행중, 1이 완료

			$list.append(html);
		}
		$list.find("p[data-state='1']").addClass("done");
		$list.find("p.done .stateCheck").attr("checked", true);
	} else {
		$(".list").html("<p class='noData'>내역없음!</p>")
	}
};

var addTask = function (title) {
	if ( id !== 0 && task.length > 1) {
		var lastNum = Number(task.length-1);
		var lastId = Number(task[lastNum].id);
		if ( id !== lastNum ) id = lastNum + 1;
	} else if ( id !== 0 && task.length === 0 ){
		id = 0;
	}
	var taskRow = {
		id : id,
		title : title,
		state : 0
	};
	task.push(taskRow);
	printList();
	$(".form #title").val("");
	id++
};

var removeTask = function (id) {
	var rowNum = task.length;
	for(var i = 0; i < rowNum; i ++) {
		if (task[i].id === id) {
			task.splice(i, 1);
			printList();
			return false;
		}
	}
};

var changeState = function (id, state) {
	var changeNum;
	var rowNum = task.length;

	if (state === 0) {
		changeNum = 1;
	} else {
		changeNum = 0;
	}
	for(var i = 0; i < rowNum; i ++) {
		if (task[i].id === id) {
			task[i].state = changeNum;
			printList();
			return false;
		}
	}
};

var listDisplay = function (state) {
	var $listElem = $(".list p");

	$listElem.show();
	if (state === 0) {
		$listElem.siblings(".done").hide();
	} else if (state === 1) {
		$listElem.not(".done").hide();
	}
};

printList();
$(".form .submit").on("click", function(){
	var title = $(".form").find("#title").val();
	addTask(title);
});

$(".toDo").on("click", ".list .chkbox", function(){
	var $thisRow = $(this).parent("p");
	var thisID = $thisRow.data("id");
	var thisState = $thisRow.data("state");
	changeState(thisID, thisState);
});

$(".toDo").on("click", ".list .remove", function(){
	var $thisRow = $(this).parent("p");
	var thisID = $thisRow.data("id");
	removeTask(thisID);
});

$(".toDo").on("click", ".view li a", function(){
	var thisState = $(this).attr("href");
	thisState = thisState.substr(1);
	event.preventDefault();

	$(".view li").removeClass("on");
	$(this).parent("li").addClass("on");

	switch (thisState){
		case "all" :
				listDisplay(2);
			break;
		case "ing" :
				listDisplay(0);
			break;
		case "end" :
				listDisplay(1);
			break;
		default :
				listDisplay(2);
			break;
	}

});

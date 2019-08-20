var videoDurationText;
var player;
let timeUpdateOnSeekUpdate = 0;
let stickyToggleStatus = false;
let loader = false;
let videoIsBeingPlayed = false;
let hide =  true;
let timer; // timer for setTimeout function
//var availableQuality;
initPlayer(conf);
drawControlBar();
	
// function that checks whether device is android or not;


  //mobileAndTabletcheck();

function initPlayer(conf)
{	
	 window.mobileAndTabletcheck = () => {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	  };
	
	window.playbackSpeeds = [0.5, 1.0, 1.25, 1.50, 2.0, 2.5, 3.0];
	window.playSpeed = 1;
	window.mute = 0;
	window.seekInterval = 15;
	//window.availableQuality;
	window.videoDuration=1;
	window.seeking = 0;
	window.stickyControl = 0;
	window.menuOpen = 0;
	window.seekbar;
	window.overlayDrawn = false;
	window.remainingTimeDisplay = 0;
	//window.videoDurationText;
	if(conf.controls.seekInterval)
		seekInterval=conf.controls.seekInterval;
	
	window.playbackProgress;
	
	//Create video element
	window.container = document.getElementById(conf.container);
	window.video = document.createElement("video");

	video.id = "videoPlayer";
	video.classList.add("videoPlayer");
	video.ondurationchange = onDurationChange;
	video.onloadedmetadata = videoMetadataLoaded;
	video.oncanplay = onCanPlay; //Stream init
	video.onplay = onVideoPlay;
	video.onpause = onVideoPause;
	video.ontimeupdate = onPlaybackTimeUpdate;
	video.onwaiting = (event) => {
		// changing that loaded boolean value from false to true so center play pause button wont work
		loader = true;
		drawLoader();
		showControl();
			};
	video.oncanplaythrough = (event) => {
		//document.querySelector('.videoplayer-loader').style.display = 'none';
		loader = false;
		clearLoader();
		if(video.onplay){
			HideControls(1000);
		}
	};
	container.appendChild(video);
	container.classList.add("playerContainer");
	setPoster();
	
	if(conf.hls)
	{
		videoURL=conf.hls;
		urlType="hls";
		
		player = new Hls();
		player.loadSource(videoURL);
		player.attachMedia(video);
		
		player.once(Hls.Events.MANIFEST_PARSED, onHlsStreamInitialized);
		player.on(Hls.Events.FRAG_BUFFERED, onHlsFragmentLoad);

		//Error Handling
		player.on(Hls.Events.ERROR, onHlsError);
		
	}
	if(conf.dash)
	{
		videoURL=conf.dash;
		urlType="dash";
		player = dashjs.MediaPlayer().create();
		player.initialize(video, videoURL, false);
		player.attachView(video);
		player.attachVideoContainer(container);
		player.on(dashjs.MediaPlayer.events.FRAGMENT_LOADING_COMPLETED, onDashFragmentLoad, this);
		player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onDashStreamInitialized, this);
	}
	else if(conf.mp4)
	{
		//console.log(typeof conf.mp4[0]);
		//TOTO handle multiple URL
		videoURL=conf.mp4;
		urlType="mp4";
		video.src = videoURL;
		//video.type = "video/mp4";
		console.log(video.type);
		availableQuality = 1;
		//TODO On Stream init
	}
	else if(conf.webm)
	{
		videoURL=conf.webm;
		urlType="webm";
		video.src = videoURL;
		console.log(video.duration);
		availableQuality = 1;
		//TODO On Stream init
	}
}

function onHlsError(event, data)
{
	var errorType = data.type;
	var errorDetails = data.details;
	var errorFatal = data.fatal;
	console.log("HLS Error, Type: "+errorType+" Details: "+errorDetails+" Fatal: "+errorFatal);
	switch(data.details) {
		case Hls.ErrorDetails.FRAG_LOAD_ERROR:
		// ....
		break;
		case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
			console.log("Manifest Parse Error");
			break;
	default:
		break;
	}
}

/*************************************************************/
// Function Defs
/*************************************************************/
// adding a listener on playercontainer 
//that call a function which adds a overlay to screen for play pause and seekforward and seek backward; 

function setPoster()
{
	if(conf.poster)
		video.poster = conf.poster;
}
function isPipSupported()
{
	return true;
}

function videoMetadataLoaded()
{
	videoDuration = video.duration;

	console.log(videoDuration);
	if(conf.controls!="false")
	
	initSeekbar();
	initProgress();
	createPlaybackSpeedMenu();
	hidePlaybackSpeedMenu();
	createQualityMenu();
	hideQualityMenu();
	//createBookmarkMenu();
	//hideBookmarkMenu();
	
	videoDuration = video.duration;
	videoDurationText = convertToTimecode(videoDuration);
	document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(video.currentTime) + " / " +videoDurationText;
	if(conf.overlay)
		initOverlay();
}
function initProgress()
{
	playbackProgress.min = 0;
	playbackProgress.max = Math.floor(videoDuration);
	playbackProgress.value = 0;
}
function onCanPlay()
{
	console.log("Can Play");
}
function onDurationChange()
{
	return;
}

function onHlsFragmentLoad()
{
	onFragmentLoad();
}
function onDashFragmentLoad()
{
	onFragmentLoad();
}
function onFragmentLoad()
{
	if(video.buffered.length==0)
		return;
	var progress;
	progress = (video.buffered.end(video.buffered.length-1) * 100) / videoDuration;
	document.getElementById("bufferProgress").value=progress;
	//console.log("Frag loaded");
}
function onHlsStreamInitialized()
{
	availableQuality = player.levels;
	//console.log("availableQuality: "+availableQuality);
}

function onDashStreamInitialized()
{
	availableQuality = player.getBitrateInfoListFor("video");
}

//Add buttons to upper control bar

// using a tracker to add 5 element in controlsLower-child1 amd 6 element controlsLower-child2;

let elementTracker = 0;

function addControlButton(id, class1, class2, label, tooltip, listener , svg , side , wrapper='') 
{	
	var elm = document.createElement("button");
	elm.id = id;
	elm.classList.add(class1);
	if(class2!="")
		elm.classList.add(class2);
	if(svg!="")
		elm.innerHTML =	`<svg class="create_icon">
							<use xlink:href="img/svg/sprite.svg#${svg}"></use>
						</svg>`;
		
	//elm.innerHTML=label;
	if(listener)
	elm.addEventListener("click", listener);
	if(side =='left'){
		if(wrapper !=  ''){
			document.querySelector(`.${wrapper}`).appendChild(elm)	
		}else{
			document.querySelector(".controlsLower-child1").appendChild(elm);
		}
	}else if(side = 'right'){
		document.querySelector(".controlsLower-child2").appendChild(elm);
			
	}
	/*if(elementTracker<=4){
		elementTracker = elementTracker + 1;
		document.querySelector(".controlsLower-child1").appendChild(elm);
		//console.log('subham' , i);
	}else{
		document.querySelector(".controlsLower-child2").appendChild(elm);
		
	}
	*/
	   
	/********** TODO Tooltip text*******************/
	/*
	var elmTip = document.createElement("span");
	elmTip.id = elm.id+"tooltip";
	elmTip.classList.add("toolTipText");
	elmTip.innerHTML=tooltip;
	elm.appendChild(elmTip);
	*/
}
function addControlDiv(classname , side){

	let div = document.createElement('div');
	div.className = classname;
	
	if(side =='left'){
		document.querySelector(".controlsLower-child1").appendChild(div);	
	}else if(side = 'right'){
		document.querySelector(".controlsLower-child2").appendChild(div);
			
	}
}
// this function add button for mobile version;
function addControlButtonForMobile(id, class1, class2, label, tooltip, listener , svg , text ) 
{	
	
	let elm = document.createElement("button");
	elm.id = id;
	elm.classList.add(class1);

	if(svg!="")
		elm.innerHTML =	`<svg class="create_icon">
							<use xlink:href="img/svg/sprite.svg#${svg}"></use>
						</svg> <span class='settingname ${svg}'>${text}</span>`;
	 let extradiv =  document.createElement('div');
	 extradiv.className = class2;
	 elm.appendChild(extradiv);

	//elm.innerHTML=label;
	if(listener)
	elm.addEventListener("click", listener);
		document.querySelector(".MBwrapper").appendChild(elm);
		
	   
	/********** TODO Tooltip text*******************/
	/*
	var elmTip = document.createElement("span");
	elmTip.id = elm.id+"tooltip";
	elmTip.classList.add("toolTipText");
	elmTip.innerHTML=tooltip;
	elm.appendChild(elmTip);
	*/

}

function addExtraButton(parentclassname ,  svg='' , listener , markup=''){
	
		markup = `<label class="switch">
		<input class='stickyToggleCheckbox' type="checkbox" value='off' >
		<span class="slider round"></span>
	  </label>`;
	
	document.querySelector(`.${parentclassname}`).insertAdjacentHTML('afterbegin' , markup);

	
	
}

//Draw control bar
function drawControlBar()
{	
	// calling drawSettingcontainer() code added by subham;
	drawSettingcontainer()
	
		
	var controlBar = document.createElement("div");
	controlBar.id = "controls";
	controlBar.classList.add("controls");
	container.appendChild(controlBar);

	//Upper control bar
	var elm = document.createElement("div");
	elm.id = "controlsUpper";
	elm.classList.add("controlsUpper");
	
	document.getElementById("controls").appendChild(elm);
	
	//Add slider range
	seekbar = document.createElement("input");
	seekbar.id = "seekRange";
	seekbar.type="range";
	seekbar.classList.add("seekRange");
	seekbar.value = 0;
	document.getElementById("controlsUpper").appendChild(seekbar);
	
	//Seekbar toolTipText
	var elmTip = document.createElement("span");
	elmTip.id = "seektimePreview";
	elmTip.classList.add("seektimePreview");
	elmTip.classList.add("hide");
	elmTip.innerHTML="00:00:00";
	document.getElementById("controlsUpper").appendChild(elmTip);

	//Add seek bar listeners
	seekbar.addEventListener("change", onSeekBarChange, true);
	seekbar.addEventListener("mousedown", onSeekbarMouseDown, false);
	seekbar.addEventListener("mouseup", onSeekbarMouseUp, false);
	seekbar.addEventListener("input", onSeeking, false);
	seekbar.addEventListener("mousemove", onSeekbarMouseMove, true);
	seekbar.addEventListener("mouseout", onSeekbarMouseOut, true);
	seekbar.addEventListener("mouseover", onSeekbarMouseOver, true);
	
	//Add playback progress

	//Add progress buffer
	var elm = document.createElement("progress");
	elm.id = "bufferProgress";
	elm.min = 0;
	elm.max = 100;
	elm.value = 0;
	elm.classList.add("bufferProgress");
	document.getElementById("controlsUpper").appendChild(elm);

	var elm = document.createElement("progress");
	elm.id = "playbackProgress";
	elm.min = 0;
	elm.max = 100;
	elm.value = 0;
	elm.classList.add("playbackProgress");
	playbackProgress = elm;
	document.getElementById("controlsUpper").appendChild(elm);
	
	
	//lower control bar
	var elm = document.createElement("div");
	elm.id = "controlsLower";
	elm.classList.add("controlsLower");
	document.getElementById("controls").appendChild(elm);
	// code written by shubham
	const controlsLowerChild1 =  document.createElement('div');
	controlsLowerChild1.className = 'controlsLower-child1';
	const controlsLowerChild2 = document.createElement('div');
	controlsLowerChild2.className = 'controlsLower-child2';

	// adding two more extra div for styling purpose 
	document.getElementById("controlsLower").appendChild(controlsLowerChild1);
	document.getElementById("controlsLower").appendChild(controlsLowerChild2);
	
	//Add buttons
	//Add seek back button
	console.log(mobileAndTabletcheck() , 'mobile');	
	if(!mobileAndTabletcheck())
		addControlButton("btnPlayPause", "btnPlayPause", "btnPlay", "", "Play", onBtnPlayPauseClick , 'icon-round-play_arrow-24px', 'left');
	if(conf.controls.seekBack != "false" && !mobileAndTabletcheck())
		addControlButton("btnSeekBack", "btnSeekBack", "", "", "Seek "+seekInterval+" Sec Back", onBtnSeekBackClick , iconsName.FastBackward , 'left');
	if(conf.controls.seekFwd != "false" && !mobileAndTabletcheck())
		addControlButton("btnSeekFwd", "btnSeekFwd", "", "", "Seek "+seekInterval+" Sec Forward", onBtnSeekFwdClick , iconsName.FastForward , 'left');
	// creating a div inside left control container tp put vol button and vol seekbar inside it;
		addControlDiv('volume-wrapper' , 'left')
	if(conf.controls.mute != "false" && !mobileAndTabletcheck())
		addControlButton("btnMute", "btnMute", "btnMuteOff", "", "Mute", onBtnMuteClick , iconsName.VolumeHigh , 'left' , 'volume-wrapper');
	if(conf.controls.volSlider != "false")
		addVolumeSlider();
	if(conf.controls.timeUpdate != "false")
		addControlButton("btnTimeDisplay", "btnTimeDisplay", "", "00:00:00 00:00:00", "Elapsed/remaining time", onBtnTimeDisplayClick , '' , 'left');		
		document.getElementById("btnTimeDisplay").innerHTML = '00:00' +  " / " + '00:00';
	if(conf.controls.bookmark = "true")
		addControlButton("btnBookmark", "btnBookmark", "", "", "Bookmarks", onBtnBookmarkClick , iconsName.bookmark , 'right');
	if(conf.controls.quality != "false")
		addControlButton("btnQualitySelector", "btnQualitySelector", "", "", "Change Playback Quality",onSettingClick , iconsName.Setting ,'' , 'right');		
	if(conf.controls.quality != "false")
		addControlButtonForMobile("btnQualitySelector", "btnQualitySelector", "", "", "Change Playback Quality",onBtnQualitySelectorClick , 'icon-film','Quality list' );		
	if((conf.controls.pip != "false") && isPipSupported() && !mobileAndTabletcheck())
		addControlButton("btnPip", "btnPip", "btnPipEnter", "", "Picture in Picture", onBtnPipClick , iconsName.Pip);
		
		if(conf.controls.speed != "false")
		addControlButtonForMobile("btnSpeedSelector", "btnSpeedSelector", "", playSpeed+"x", "Playback Speed", onBtnSpeedSelectorClick , 'icon-meter' , 'Speed');	
	if(conf.controls.sticky == "true")
		addControlButtonForMobile("btnSticky", "btnSticky", "stickyToggle", "", "Autohide control bar", '' , 'icon-pushpin' , 'Lock screen' );
		addExtraButton('stickyToggle')	
	if(conf.controls.fullscreen != "false")
		addControlButton("btnFullscreen", "btnFullscreen", "btnFullscreenEnter", "", "Fullscreen", onBtnFullscreenClick , iconsName.FullScreen);		
	
	
	drawBigPlayButton();

	
	//Set Auto hide
	if(conf.controls.autoHide != "false")
	{	
		controlBar = document.getElementById("controls");
		controlBar.addEventListener("mouseover", onControlBarMouseover, true);
		controlBar.addEventListener("mouseout", onControlBarMouseout, true);
	}
}
function hideControlbar(){
	//console.log('hello world');	
	if(stickyControl || video.paused || menuOpen || hide == false)
		return;
	document.getElementById("controls").style.opacity = 0;

}

function showControlbar(){
	if(stickyControl)
		return;
	document.getElementById("controls").style.opacity = 1;
//	document.getElementById("btnBigPlay").style.display= 'block';
}
function drawBigPlayButton()
{	

	var elm = document.createElement("div");
	elm.id = "btnBigPlay";
	elm.classList.add("btnBigPlay");
	const center =  document.createElement('div');
	center.className = 'Bigbtnicon';
	container.appendChild(elm);
	elm.appendChild(center);
	const icons = [iconsName.FastForward,  iconsName.CenterPlay  , iconsName.FastBackward]
	icons.forEach((element) => {
		center.insertAdjacentHTML('afterbegin' , `<a href='#' class='${element}-wrapper'><svg class="create_icon ${element} bg">
				<use xlink:href="img/svg/sprite.svg#${element}"></use></a>
			</svg>`);
		if(!mobileAndTabletcheck()){
			document.querySelector('.bg').style.display = 'none';
		}
		
	});

	

	console.log("Big play button");
}

// function that insert loader inside center


const drawLoader = () => {

	const markup = `<div class="videoplayer-loader">
					<div class="fourth-layer">
						<div class="third-layer">
							<div class="second-layer">
							<div class="first-layer"> </div>
							</div>
						</div>
					</div>
					<div class="logo-container">
					<img src="img/vision.png" alt="logo">
					</div>
					</div>`;
	/*document.querySelector(`.${iconsName.CenterPlay}-wrapper`).innerHTML = '';*/
	document.querySelector(`.${iconsName.CenterPlay}-wrapper`).insertAdjacentHTML('afterbegin' , markup);



}

const clearLoader = () => {
	if(mobileAndTabletcheck()){
		if(!videoIsBeingPlayed){
			document.querySelector(`.${iconsName.CenterPlay}-wrapper`).innerHTML = `<svg class="create_icon ">
			<use xlink:href="img/svg/sprite.svg#${iconsName.CenterPlay}"></use></svg>`
		}else{
			document.querySelector(`.${iconsName.CenterPlay}-wrapper`).innerHTML = `<svg class="create_icon ">
			<use xlink:href="img/svg/sprite.svg#${iconsName.CenterPause}"></use></svg>`
		}
	}else{
		document.querySelector(`.${iconsName.CenterPlay}-wrapper`).innerHTML = ``;
	}
}

function drawSettingcontainer(){
	// this will draw a div which will contain all the html related to settings;
//	if(screen.width <= 900){
		const settingcontainer = document.createElement('div');
		settingcontainer.className = 'setting_container';
		container.appendChild(settingcontainer);
			
		const div = document.createElement('div');
		div.id = 'MBwrapper'; // MObile Button Wrapper
		div.className = 'MBwrapper';
		document.querySelector(".setting_container").appendChild(div);
	

//	}
	
}
function onControlBarMouseover()
{
	showControl();
}
function onControlBarMouseout()
{
	HideControls(1000);
}
function onBtnStickyClick()
{	

	stickyControl = 1 - stickyControl;

}
async function onBtnPipClick() //TODO
{
	try {
		await video.requestPictureInPicture();
	}
	catch(error) {
		console.log("Pip Error"+error);
		// TODO: Show error message to user.
	}
	finally {
		this.disabled = false;
	}
}
/*************************************************************************************************/
//Bookmarks
/*************************************************************************************************/
function onBtnBookmarkClick()
{
	if(!document.getElementById("bookmarkMenu"))
	{
		createBookmarkMenu();
		return;
	}
	if(document.getElementById("bookmarkMenu").classList.contains("hide"))
	{
		showBookmarkMenu();
	}
	else
	{
		//document.getElementById("bookmarkMenu").classList.add("hide");
		hideBookmarkMenu();
	}
}
function showBookmarkMenu()
{
	menuOpen = 1;
	elm = document.getElementById("bookmarkMenu");
	elm.style.left=document.getElementById("btnBookmark").offsetLeft;
	elm.style.bottom=document.getElementById("controls").offsetHeight;
	document.getElementById("bookmarkMenu").classList.remove("hide");
	document.getElementById("txtAddBookmark").focus();
	window.bookmarkTime = video.currentTime;
}
function hideBookmarkMenu()
{
	menuOpen = 0;
	document.getElementById("bookmarkMenu").classList.add("hide");
}
function createBookmarkMenu()
{
	if (window.XMLHttpRequest)
	{
            //for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
    }
	else
	{
        //for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            createBookmarksList(this.responseText);
        }
    };
    xmlhttp.open("GET","bookmarks/getbookmarks.php?url="+videoURL,true);
    xmlhttp.send();
}
function createBookmarksList(val)
{
	var bookmarkMenuWidth = 30;
	//console.log(val);
	var bookmarks = JSON.parse(val);
	var elm = document.createElement("div");
	elm.id = "bookmarkMenu";
	elm.classList.add("bookmarkMenu");
	elm.classList.add("menu");
	document.getElementById("controlsUpper").appendChild(elm);
	elm = document.createElement("ul");
	elm.id="bookmarkList";
	elm.classList.add("menu");
	document.getElementById("bookmarkMenu").appendChild(elm);

	for (var i = 0; i < bookmarks.length; i++)
	{
		elm = document.createElement("li");
		if (bookmarks[i].comment.length > bookmarkMenuWidth)
			bookmarkText = bookmarks[i].comment.slice(0,bookmarkMenuWidth) + "...";
		else
			bookmarkText = bookmarks[i].comment;

		//Add delete button
		var btn = document.createElement("BUTTON");
		btn.classList.add("btnBookmarkDelete");
		btn.id="btnBookmarkDelete";
		elm.appendChild(btn);
		btn.addEventListener("click", onBookmarkDeleteClick.bind(this, bookmarks[i].bookmark_id), false);
		txt = document.createTextNode(convertToTimecode(bookmarks[i].location) +" - "+bookmarkText);
		elm.appendChild(txt);
		elm.id="bookmark-index-"+i;
		elm.title=bookmarks[i].comment;		//TODO make it div/span
		elm.classList.add("menu-item-bookmarks");
		document.getElementById("bookmarkList").appendChild(elm);
		elm.addEventListener("click",onBookmarkItemClick.bind(this, bookmarks[i].location), false);
	}

	//Add new bookmark
	var inputBox = document.createElement("input");
	inputBox.id = "txtAddBookmark";
	inputBox.classList.add("txtAddBookmark");
	inputBox.autocomplete="off";
	document.getElementById("bookmarkList").appendChild(inputBox);
	//TODO Readonly timestamp http://jsfiddle.net/Yt72H/
	
	//Add button
	var btn = document.createElement("BUTTON");
	btn.classList.add("btnBookmarkAdd");
	btn.id="btnBookmarkAdd";
	document.getElementById("bookmarkList").appendChild(btn);
	btn.addEventListener("click", onBookmarkAddClick);
	//Reposition
	elm = document.getElementById("bookmarkMenu");
	elm.style.left=document.getElementById("btnBookmark").offsetLeft;
	elm.style.bottom=document.getElementById("controls").offsetHeight;
}
function onBookmarkAddClick(val)
{
	//TODO Disable textbox till added
	console.log(document.getElementById("txtAddBookmark").value + video.currentTime);
	
	if (window.XMLHttpRequest)
	{
        xmlhttp = new XMLHttpRequest();
    }
	else
	{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            refreshBookmarkMenu(this.responseText);
        }
    };
    xmlhttp.open("GET","bookmarks/addbookmark.php?url="+videoURL+"&comment="+document.getElementById("txtAddBookmark").value+"&timestamp="+video.currentTime, true);
    xmlhttp.send();
	
	console.log("Bookmark at "+convertToTimecode(video.currentTime)+" added");
}
function refreshBookmarkMenu()
{
	deleteBookmarkMenu();
	createBookmarkMenu();
	//showBookmarkMenu();
}
function deleteBookmarkMenu()
{
	var elm = document.getElementById("bookmarkMenu");
	elm.parentNode.removeChild(elm);
}
function onBookmarkDeleteClick(val)
{
	//TODO
	if (window.XMLHttpRequest)
	{
        xmlhttp = new XMLHttpRequest();
    }
	else
	{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            refreshBookmarkMenu(this.responseText);
        }
    };
    xmlhttp.open("GET","bookmarks/deletebookmark.php?id="+val, true);
    xmlhttp.send();
	
	console.log("Bookmark id "+val +" Deleted");
}
function onBookmarkItemClick(val)
{
	if(event.target.id=='btnBookmarkDelete')
		return;
	video.currentTime = val;
	hideBookmarkMenu();
}

/*************************************************************************************************/
//Mute & Volume
/*************************************************************************************************/
function addVolumeSlider()
{
	volSeekbar = document.createElement("input");
	volSeekbar.id = "volSeekRange";
	volSeekbar.type="range";
	volSeekbar.classList.add("volSeekRange");
	document.querySelector(".volume-wrapper").appendChild(volSeekbar);
	volSeekRange.min=0;
	volSeekRange.max=1;
	volSeekRange.step=0.01;
	//volSeekRange.value=1; //TODO Get from cookie
	volSeekRange.value = video.volume;
	volSeekbar.addEventListener("input", onVolSeeking, false);
}
function onVolSeeking()
{
	video.volume = this.value;
	if (this.value==0)
		setMuteOn();
	else
		setMuteOff();

	console.log(video.volume);
}
function onBtnMuteClick()
{
	if(mute)
	{
		setMuteOff();
	}
	else
	{
		setMuteOn();
	}
	console.log("Mute clicked: "+video.volume);
}
function setMuteOn()
{
	elm = document.getElementById("btnMute");
	elm.innerHTML = '';
	elm.innerHTML = `<svg class="create_icon">
		<use xlink:href="img/svg/sprite.svg#${iconsName.VolumeMute}"></use>
	</svg>`;
	video.muted = true;
	mute = 1;
	document.getElementById("volSeekRange").value = 0;
}
function setMuteOff()
{
	elm = document.getElementById("btnMute");
	elm.innerHTML = '';
	elm.innerHTML = `<svg class="create_icon">
		<use xlink:href="img/svg/sprite.svg#${iconsName.VolumeHigh}"></use>
	</svg>`;
	
	elm.classList.remove('btnMuteOn');
	elm.classList.add('btnMuteOff');
	video.muted = false;
	mute = 0;
	document.getElementById("volSeekRange").value = video.volume;
}
	
/*************************************************************************************************/
//Seekbar
/*************************************************************************************************/
function initSeekbar()
{
	seekbar = document.getElementById("seekRange");
	seekbar.min = 0;
	seekbar.max = Math.floor(videoDuration);	//TODO
	seekbar.range = 1;
	seekbar.value = 0;
}
function onSeekBarChange()
{	
	
	video.currentTime = seekbar.value;
	
}
function onSeekbarMouseDown()
{
	seeking = 1;
}
function onSeekbarMouseUp()
{
	seeking = 0;
}
function onSeeking()
{
	var curTime = seekbar.value;
	if(timeUpdateOnSeekUpdate == 0){
		document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(curTime - (videoDuration * remainingTimeDisplay)) + " / " +videoDurationText;
		seekbar.value = curTime;
		playbackProgress.value = curTime;
	}else{
		document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(timeUpdateOnSeekUpdate) + " / " +videoDurationText;
		seekbar.value = timeUpdateOnSeekUpdate;
		playbackProgress.value = timeUpdateOnSeekUpdate;
		video.currentTime = timeUpdateOnSeekUpdate;
		console.log(seekbar.value , 'else condition is working');
	}
	//document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(curTime - (videoDuration * remainingTimeDisplay)) + " / " +videoDurationText;
	

}
function onSeekbarMouseOver(event)
{
	tooltip = document.getElementById("seektimePreview");
	tooltip.classList.remove('hide');
	tooltip.style.opacity = 1;
}
function onSeekbarMouseMove(event)
{
	var curTime = seekbar.value;
	tooltip = document.getElementById("seektimePreview");
	var pos = event.offsetX;
	var w = window.seekbar.offsetWidth;
	var tooltipwidth = tooltip.offsetWidth
	if(pos < 5){
		pos=0;
	}
	if((pos -  (tooltipwidth / 2) <= w-tooltipwidth) && (pos -  (tooltipwidth / 2) >= 0)){
		tooltip.style.marginLeft = pos -  (tooltipwidth / 2)
		
	}
	if(seeking)
		tooltip.innerHTML = convertToTimecode(curTime - (videoDuration * remainingTimeDisplay));
	else
		tooltip.innerHTML = convertToTimecode((videoDuration/w) * pos)
		timeUpdateOnSeekUpdate = (videoDuration/w) * pos;
		
		//convertToTimecode((Math.floor(videoDuration)/w) * Math.floor(pos));
		//document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(curTime - (videoDuration * remainingTimeDisplay)) + " / " +videoDurationText;
		
}
function onSeekbarMouseOut()
{
	tooltip = document.getElementById("seektimePreview");
	tooltip.style.opacity = 0;
	tooltip.classList.add('hide');
}
//Seek buttons
function onBtnSeekBackClick()
{
	video.currentTime = video.currentTime - seekInterval;
}
function onBtnSeekFwdClick()
{
	video.currentTime = video.currentTime + seekInterval;
	
}

/*************************************************************************************************/
//Playback Time Update
/*************************************************************************************************/
function onBtnTimeDisplayClick()
{
	//TODO
	remainingTimeDisplay = 1 - remainingTimeDisplay;
	onPlaybackTimeUpdate();
	//console.log(remainingTimeDisplay);
}
function onPlaybackTimeUpdate()	//TODO onSeeking
{
	if(seeking)
		return;
	var curTime = video.currentTime;
	document.getElementById("btnTimeDisplay").innerHTML = convertToTimecode(curTime - (videoDuration * remainingTimeDisplay)) + " / " +videoDurationText;
	seekbar.value = curTime;
	playbackProgress.value = curTime;
}
//*************************************************************************************************
// QUALITY MENU
//*************************************************************************************************
function onBtnQualitySelectorClick()
{	
	hidePlaybackSpeedMenu();
	toggleMBwrapper('none'); // true is being passed so that it hide that WBrapper;
	//Toggle menu
	if(document.getElementById("qualitySelectorMenu").classList.contains("hide"))
	{
		showQualityMenu();
	}
	else
	{
		hideQualityMenu();
		//document.getElementById("qualitySelectorMenu").classList.add("hide");
	}
}

function onSettingClick() {
	if(hide){
		toggleMBwrapper('flex' ,'.setting_container')
		hide = false;
	}else{
		toggleMBwrapper('none' ,'.setting_container')
		hide = true;
		HideControls(1000);
	}
}

// function that male mobile buttons wrapper container hide and visible

function toggleMBwrapper(display , dom='#MBwrapper') {
	
			document.querySelector(dom).style.display= display;
						
}

function createQualityMenu()
{
	var elm = document.createElement("div");
	elm.id = "qualitySelectorMenu";
	elm.classList.add("qualitySelectorMenu");
	elm.classList.add("menu");
	//if(window.screen.width <= 900){
		elm.innerHTML = `<div class='setting-header'><svg class="create_icon">
		<use xlink:href="img/svg/sprite.svg#icon-rewind"></use>
	</svg> <span class="settingname">Quality list</span></div>`
		document.querySelector('.setting_container').appendChild(elm);
//	}
	/*else{
		document.getElementById("controlsUpper").appendChild(elm);
	}*/

	

	elm = document.createElement("ul");
	elm.id="qualityList";
	elm.classList.add("menu");
	document.getElementById("qualitySelectorMenu").appendChild(elm);
	
	//TODO If single level, then no menu
	console.log(availableQuality);
	if(availableQuality==1)
	{
		document.getElementById("btnQualitySelector").innerHTML= `${video.height}  p`;
		return;
	}
	//Auto switch quality
	elm = document.createElement("li");
	txt = document.createTextNode("Auto");
	elm.appendChild(txt);
	elm.id="video-quality-index--1";
	elm.classList.add("menu-item-selected");
	document.getElementById("qualityList").appendChild(elm);
	elm.addEventListener("click",onQualityItemClick.bind(this,-1), true);

	for (var i = 0; i < availableQuality.length; i++)
	{
		elm = document.createElement("li");
		txt = document.createTextNode(availableQuality[i].height+"p");
		elm.appendChild(txt);
		elm.id="video-quality-index-"+i;
		elm.classList.add("menu-item-unselected");
		document.getElementById("qualityList").appendChild(elm);
		elm.addEventListener("click",onQualityItemClick.bind(this,i), true);
	}
}
function onQualityItemClick(index)
{
	//var availableQuality = player.getBitrateInfoListFor("video");
	for (var i = -1; i <  availableQuality.length; i++)
	{
		document.getElementById("video-quality-index-"+i).classList.remove("menu-item-selected");
		document.getElementById("video-quality-index-"+i).classList.add("menu-item-unselected");
		//document.getElementById("video-quality-index-"+index).classList.add("menu-item-selected");
	}
	if(index == -1)
	{
		if(urlType=="hls")
		{
			player.loadLevel=-1;
		}
		else if(urlType=="dash")
		{
			player.setAutoSwitchQualityFor('audio', true);
			player.setAutoSwitchQualityFor('video', true);
		}
	}
	else
	{
		if(urlType=="hls")
		{
			player.loadLevel=index;
			console.log("Quality "+availableQuality[index].width);
		}
		else if(urlType=="dash")
		{
			player.setAutoSwitchQualityFor('audio', false);
			player.setAutoSwitchQualityFor('video', false);
			player.setQualityFor('video', index);
		}
	}
	document.getElementById("video-quality-index-"+index).classList.add("menu-item-selected");
	hideQualityMenu(); 						//Hide menu
	toggleMBwrapper('block'); // block is being passed so that it hide that WBrapper;
	
}
function hideQualityMenu()
{
	menuOpen = 0;
	document.getElementById("qualitySelectorMenu").classList.add("hide");
}
function showQualityMenu()
{
	menuOpen = 1;
	elm = document.getElementById("qualitySelectorMenu");
	elm.style.left=document.getElementById("btnQualitySelector").offsetLeft;
	elm.style.bottom=document.getElementById("controls").offsetHeight;
	document.getElementById("qualitySelectorMenu").classList.remove("hide");
}
/**************************************************************************************************/
// PLAYBACK SPEED
/**************************************************************************************************/

function onDocumentClick()
{
	if((event.target.id=='btnSpeedSelector') || (event.target.id=='btnQualitySelector'))
		return;
	hideQualityMenu();
	hidePlaybackSpeedMenu();
}

function onBtnSpeedSelectorClick()
{
	hideQualityMenu();
	toggleMBwrapper('none');
	
	if(document.getElementById("playbackSpeedMenu").classList.contains("hide"))
	{
		showPlaybackSpeedMenu();
	}
	else
	{
		hidePlaybackSpeedMenu();
	}
}

function createPlaybackSpeedMenu()
{
		
	var elm = document.createElement("div");
	elm.id = "playbackSpeedMenu";
	elm.classList.add("playbackSpeedMenu");
	elm.classList.add("menu");
	//document.getElementById("controlsUpper").appendChild(elm);
	
	document.querySelector('.setting_container').appendChild(elm)
	elm = document.createElement("ul");
	elm.id="playbackSpeedList";
	elm.classList.add("menu");
	document.getElementById("playbackSpeedMenu").appendChild(elm);
	document.getElementById("playbackSpeedMenu").insertAdjacentHTML("afterbegin" , `<div class='setting-header'><svg class="create_icon">
										<use xlink:href="img/svg/sprite.svg#icon-rewind"></use>
									</svg> <span class="settingname">Playback speed</span></div>`);
	for (var i = 0; i < playbackSpeeds.length; i++)
	{
		elm = document.createElement("li");
		txt = document.createTextNode(playbackSpeeds[i]+"x");
		elm.appendChild(txt);
		elm.id="playback-speed-index-"+i;
		elm.classList.add("menu-item-unselected");
		document.getElementById("playbackSpeedList").appendChild(elm);
		elm.addEventListener("click",onPlaybackSpeedItemClick.bind(this,i), true);
	}
}
function onPlaybackSpeedItemClick(index)
{
	video.playbackRate=playbackSpeeds[index];
	document.querySelector(".icon-meter").innerHTML=playbackSpeeds[index]+'x';
	hidePlaybackSpeedMenu();
	toggleMBwrapper('block');
	console.log("Playback rate set to "+video.playbackRate);
}
function hidePlaybackSpeedMenu()
{
	//menuOpen = 0;
	//document.getElementById("playbackSpeedMenu").classList.add("hide");
	hideMenu("playbackSpeedMenu");
}
function showPlaybackSpeedMenu()
{
	showMenu("playbackSpeedMenu", "btnSpeedSelector");
}
function hideMenu(menu)
{
	menuOpen =0;
	elm = document.getElementById(menu);
	elm.classList.add("hide");
}

function showMenu(menu, button)
{
	menuOpen =1;
	elm = document.getElementById(menu);
	elm.style.left=document.getElementById(button).offsetLeft;
	elm.style.bottom=document.getElementById("controls").offsetHeight;
	elm.classList.remove("hide");
}
/**************************************************************************************
// FULLSCREEN
/**************************************************************************************/
function onBtnFullscreenClick()
{
	if(!isFullscreen())
	{
		//element = container || video;
		element = document.getElementById('playerContainers');
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else {
			element.webkitRequestFullScreen();
		}
		screen.orientation.lock("landscape-primary");
		}
	else
	{
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else {
			document.webkitCancelFullScreen();
		}
		screen.orientation.unlock();
		
	}
	onFullScreenChange();
	}
function onFullScreenChange()
{	
	if(isFullscreen())
	{
		document.querySelector('#btnFullscreen').innerHTML = `<svg class="create_icon">
		<use xlink:href="img/svg/sprite.svg#${iconsName.FullScreen}"></use>
	</svg>`
		
	}
	else
	{
		document.querySelector('#btnFullscreen').innerHTML = `<svg class="create_icon">
		<use xlink:href="img/svg/sprite.svg#${iconsName.ExitfullScreen}"></use>
	</svg>`
	}
}
function isFullscreen()
{
	return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen;
}


function stickyToggle(){
//stickyToggleStatus

	if(!stickyToggleStatus){
		document.querySelector('.stickyToggleCheckbox').setAttribute('checked' , true);
		const status = document.querySelector('.stickyToggleCheckbox').value = true;

		if(status){
			stickyToggleStatus = true;
			showControl();
		}
		
		
	}else{
		document.querySelector('.stickyToggleCheckbox').removeAttribute('checked');
		const status = document.querySelector('.stickyToggleCheckbox').value = false;
		if(!status){
			stickyToggleStatus = false;
			HideControls(1000);
		}
	}
	

}
/******************************************************************************************************************************/
/*Play Pause*/
/******************************************************************************************************************************/
let playpausebutton = true;
let timeout;

document.getElementById('playerContainers').addEventListener('click' , (e) => {
	//console.log(e.target.className);
	//console.log(e.target.id);
	e.preventDefault();
	console.log(e.target);
	if(e.target.matches('#btnBigPlay , .btnBigPlay , .Bigbtnicon')){
		console.log('player container was clicked');
		showControl();
		return;
	}else if(e.target.matches('#videoplayer , .videoplayer')){
		console.log('playpause');
		//document.getElementById("btnBigPlay").style.display= 'block';
		showControl();
		HideControls(4000);
		return;
	}else if(e.target.matches(`.${iconsName.FastBackward}-wrapper , .${iconsName.FastBackward} *`)){
		console.log('backward was clicked');
		onBtnSeekBackClick();
		return;
		//asdas
	}else if(e.target.matches(`.${iconsName.FastForward}-wrapper , .${iconsName.FastForward} *`)){
		console.log('forward was clicked');
		onBtnSeekFwdClick();
		return;
	}else if(e.target.matches('.stickyToggle  *')){

		// using a toggle button to enable and disable toggle feature;
		console.log('clicked');
		stickyToggle();

	}else if(e.target.matches(`.${iconsName.CenterPlay}-wrapper *`)){
		// on works if loader is not is screen;
		if(!loader){
			onBtnPlayPauseClick();
			if(playpausebutton){
				playpausebutton =  false;
			}else{
				console.log(playpausebutton);
				onVideoPause();
				playpausebutton =  true;	
				
			}
		}
		
		// creating a toggle button for 
		return;
	}else if(e.target.matches('.setting-header *')){

		hideQualityMenu(); 	
		hidePlaybackSpeedMenu();
		toggleMBwrapper('block'); // block is being passed so that it hide that WBrapper;

		

	}
});

const HideControls = (cleartime) => {
	console.log('control hidden');
	clearTimeout(timer);
	
	timer = setTimeout(() => {
		// hide controls
		if(hide && !stickyToggleStatus && !video.paused && !loader){
			hideControlbar();
			document.getElementById("btnBigPlay").style.display= 'none';
		//	hide=true;
			toggleMBwrapper('none' , '.setting_container');
		//	document.getElementById("btnBigPlay").style.display= 'none';

		}
	}, cleartime)

	

}
const showControl = () => {
	console.log('control shown');
	clearTimeout(timer);
	showControlbar();
	document.getElementById("btnBigPlay").style.display= 'block';

	
	
} 

function onBtnPlayPauseClick()
{
	if(video.paused)
	{
		video.play();
		
		// videoisbeingplayed boolean will be used in clear loader to render correct button;
		videoIsBeingPlayed = true;
		
	}
	else
	{
		video.pause();
		videoIsBeingPlayed = false;
		
		
	}
	//TODO Ping referer validate URL
}
function onVideoPause()
{
//	if(window.screen.width > 900){

	console.log('video paused');
		
	btn = document.getElementById("btnPlayPause");
	bigBtn = document.getElementById("btnBigPlay");
	centerPlay = document.querySelector(`.${iconsName.CenterPlay}-wrapper`);
	if(!mobileAndTabletcheck()){
		btn.innerHTML = '';
		btn.innerHTML = `<svg class="create_icon">
			<use xlink:href="img/svg/sprite.svg#${iconsName.Play}"></use>
		</svg>`;
	}
	centerPlay.innerHTML = '';
	if(mobileAndTabletcheck()){
		centerPlay.innerHTML = `<svg class="create_icon">
			<use xlink:href="img/svg/sprite.svg#${iconsName.CenterPlay}"></use>
		</svg>`
	}
	
	deleteTextOverlay();
	showControl();
				

}
function onVideoPlay()
{	
	
	console.log('video played');
	btn = document.getElementById("btnPlayPause");
	centerPlay = document.querySelector(`.${iconsName.CenterPlay}-wrapper`);
	if(!mobileAndTabletcheck()){
		btn.innerHTML = '';
		btn.innerHTML = `<svg class="create_icon">
			<use xlink:href="img/svg/sprite.svg#${iconsName.Pause}"></use>
		</svg>`;
	}
	centerPlay.innerHTML = '';
	if(mobileAndTabletcheck()){
		centerPlay.innerHTML = `<svg class="create_icon">
			<use xlink:href="img/svg/sprite.svg#${iconsName.CenterPause}"></use>
		</svg>`;
	}
	
	//document.getElementById("btnBigPlay").style.display= 'none';
	if(overlayDisplayTimeout == 0)
		drawTextOverlay(true);
	else
		drawTextOverlay(false);

	//TODO: If mouse not on control bar, hide control bar
	
	//}
	
	HideControls(1000);

}
/****************************************************************************/
//TEXT OVERLAY
//TODO Min & Max Duration of display & timeout
/****************************************************************************/
function initOverlay()
{
	window.overlayText = (conf.overlay.overlayText) ? (conf.overlay.overlayText) : "Text Overlay";
	window.overlayPosX = conf.overlay.posX ? conf.overlay.posX : "Math.random()*(container.offsetWidth - elm.offsetWidth)";
	window.overlayPosY = conf.overlay.posY ? conf.overlay.posY : "Math.random()*(container.offsetHeight - elm.offsetHeight) - 90";
	window.overlayDisplayDuration = conf.overlay.displayDuration ? conf.overlay.displayDuration : "Math.random()*5000";
	window.overlayDisplayTimeout = conf.overlay.displayTimeout ? conf.overlay.displayTimeout : "Math.random()*5000 + 100";	//+100 to avoid 0

}
function drawTextOverlay(permanent)
{
	//console.log("Drawing");
	if(overlayDrawn==true)
		return;
	var elm = document.createElement("span");
	elm.id = elm.id+"textOverlay";
	elm.classList.add("textOverlay");
	elm.innerHTML=overlayText;
	container.appendChild(elm);
	
	elm.style.left = eval(overlayPosX);
	elm.style.top = eval(overlayPosY);
	
	overlayDrawn = true;
	if(!permanent)
		window.setTimeout(deleteTextOverlay, eval(overlayDisplayDuration));
}
function deleteTextOverlay()
{
	if(!overlayDrawn)
		return;
	elm = document.getElementById("textOverlay");
	elm.parentNode.removeChild(elm);
	overlayDrawn = false;
	if(video.paused)
		return;
	window.setTimeout(drawTextOverlay, eval(overlayDisplayTimeout));
	//console.log("Deleted");
}

/****************************************************************************/
function convertToTimecode(d){
	var sign ="";
	if(d<0)
	{
		d = d * (-1);
		sign = "-";
	}
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	if(h<10 && h>0)
		h="0"+h+":";
	else
		h="";
	if(m<10)
		m="0"+m;
	if(s<10)
		s="0"+s;
	return(sign+h+m+":"+s);
}

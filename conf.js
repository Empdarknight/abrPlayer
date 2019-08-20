/*
overlay: {
    overlayText: "ksdwivedi@visionias.in", //Random text, if blank
    posX: 0,	//Random if not set
    posY: 0,	//Random if not set
    displayDuration: 5,	//Always on if 0, random if not set
    minDisplayDuration:	//default 1000
    maxDisplayDuration:	//Default 10000
    displayTimeout: 5	//Always on if 0, random if not set
    minDisplayTimeout: //default 10000
    maxDisplayTimeout:	//300000
},

*/

const conf = {

    container: "playerContainer",
    get link(){
        const isIOS =  navigator.platform && /iPad|iPhone/.test(navigator.platform);

        if(!isIOS){
            console.log(navigator.platform)
             return {
                 hls:"http://104.199.144.5:1935/vod/smil:4380201902171700.smil/playlist.m3u8"
             }
        }else{
            return{
                dash:"https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd"
            }
        }

    },

   // hls:'https://visionias.akamaized.net/vision-vod/smil:test.smil/playlist.m3u8?hdnts=<?php print $token; ?>',
    // hls:"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    // using hls: "http://104.199.144.5:1935/vod/smil:4380201902171700.smil/playlist.m3u8",
    //hls: "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8",
  // dash:"https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
    //dash: "http://192.169.10.5:1935/vod/smil:42151608201701.smil/manifest.mpd",
    //mp4: ["http://localhost/player/720p.mp4", "http://localhost/player/stock.mp4"],
    //mp4: "http://192.169.10.5/player/720p.mp4",
    //webm: "http://localhost/player/stock.webm",
    poster: "http://localhost/player/poster.jpg",
    controls: {
        play: "true",
        seekBack: "true",
        seekFwd: "true",
        seekInterval: 15,
        sticky: "true",
        autoHide: "true"
    },
    overlay: {
        overlayText: "ksdwivedi@visionias.in",
        pposX: 100,
        pposY: 200,
        ddisplayDuration: 2000,
        ddisplayTimeout: 2000
    },
    refValidate: {
        image: "http://192.169.10.5:1935/vod/smil:42151608201701.smil/image.gif",
        timeout: 300
    },
    bookmark: {
        storage: "db",
        configFile: "bookmark/config.php",
    }
};

const iconsName = {

    CenterPlay:'icon-round-play_circle_outline-24px',
    CenterPause:'icon-round-pause_circle_outline-24px',
    FastForward:'icon-round-fast_forward-24px',
    FastBackward:'icon-round-fast_rewind-24px',
    Pip:'icon-round-picture_in_picture_alt-24px',
    bookmark:'icon-round-collections_bookmark-24px',
    FullScreen:'icon-round-fullscreen-24px',
    ExitfullScreen:'icon-round-fullscreen_exit-24px',
    VolumeMute:'icon-round-volume_off-24px',
    VolumeHigh:'icon-round-volume_up-24px',
    Setting:'icon-round-settings-24px',
    Play:'icon-round-play_arrow-24px',
    Pause:'icon-round-pause-24px',
    bookmarkList:'icon-round-format_list_bulleted-24px',
    delete:'icon-round-delete_outline-24px'
}
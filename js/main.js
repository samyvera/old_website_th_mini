var keyCodes = new Map([
    [37, "left"],
    [38, "up"],
    [39, "right"],
    [40, "down"],
    [87, "shoot"]
]);
var trackKeys = codes => {
    var pressed = new Map();
    codes.forEach(code => pressed.set(code, false));
    var handler = event => {
        if (codes.get(event.keyCode) !== undefined) {
            var down = event.type === "keydown";
            pressed.set(codes.get(event.keyCode), down);
            event.preventDefault();
        }
    };
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
};
var keys = trackKeys(keyCodes);

var show = id => {
    document.getElementById(id).style.backgroundImage = "url(img/" + id + "-a.png)";
    document.getElementById('label').style.backgroundImage = "url(img/" + id + "-c.png)";
}
var hide = id => {
    document.getElementById(id).style.backgroundImage = "url(img/" + id + "-b.png)";
    document.getElementById('label').style.backgroundImage = null;
}

var initGame = () => {
    document.getElementById('button').style.display = 'none';

    var canvas = document.getElementById('canvas');
    canvas.style.display = 'flex';
    var cx = canvas.getContext("2d");
    
    var game = new Game();
    var display = new Display(game, cx, { x:64, y:16 });
    var frame = () => {
        if (display.size.y === 128) {
            game.update(keys);
            display.drawFrame();
        }
        else {
            canvas.height += 32;
            cx.scale(4, 4);
            cx.imageSmoothingEnabled = false;
            display.size.y += 8;
            display.drawHUD();
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

window.onload = () => {
    var banner = document.createElement('div');
    banner.id = 'banner';
    document.body.appendChild(banner);

    var canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = 256;
    canvas.height = 64;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    var share = document.createElement('div');
    share.id = 'share';
    var score = document.createElement('div');
    score.id = 'score';
    var tweet = document.createElement('a');
    tweet.id = "tweet";
    tweet.target = '_blank';
    var close = document.createElement('div');
    close.id = 'close';
    close.onclick = () => {
        document.getElementById('share').style.display = 'none';
        document.getElementById('canvas').style.display = 'flex';
    }
    share.appendChild(score);
    share.appendChild(tweet);
    share.appendChild(close);
    document.body.appendChild(share);

    var button = document.createElement('button');
    button.id = 'button';
    button.onmouseover = () => show('button');
    button.onmouseout = () => hide('button');
    button.onclick = () => initGame();
    document.body.appendChild(button);

    var links = document.createElement('div');
    links.id = 'links';
    [{
            id: 'games',
            url: 'https://samyvera.itch.io/'
        },
        {
            id: 'dev',
            url: 'https://github.com/samyvera/'
        },
        {
            id: 'twitter',
            url: 'https://twitter.com/5amyVera/'
        },
        {
            id: 'art',
            url: 'https://5amyvera.deviantart.com/'
        }
    ].forEach(link => {
        var element = document.createElement('a');
        element.id = link.id;
        element.className = 'link';
        element.target = "_blank";
        element.href = link.url;
        element.style.backgroundImage = "url(img/" + link.id + "-b.png)";
        element.onmouseover = () => show(link.id);
        element.onmouseout = () => hide(link.id);
        links.appendChild(element);
    });
    document.body.appendChild(links);

    var label = document.createElement('div');
    label.id = 'label';
    document.body.appendChild(label);
}
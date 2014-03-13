var _Score = 0,
    _yOffset = 0,
    _xOffset = 5,
    _introStartUp = [],
    _lives = 3,
    _initGame = false;

function setupUI() {
    setupIntro();
    //setupGUI()
}

function setupIntro() {
    var bimg = new Image();
    bimg.src = "images/pattern.png";
    bimg.onload = function(evt) {
        _txtWelcome = new createjs.Text("Welcome", "bold 62px airone", "");
        _txtWelcome.color = "#00a7f7";
        stage.addChild(_txtWelcome);
        _txtWelcome = widthAdjust(_txtWelcome);
        _txtWelcome.y = 20;
        _introStartUp.push(_txtWelcome);
        _txtStart = new createjs.Text("Get Ready!", "bold 62px airone", "");
        _txtStart.color = "#00a7f7";
        _txtStart = widthAdjust(_txtStart);
        _introStartUp.push(_txtStart);
        stage.addChild(_txtWelcome);
        _txtInsturctions = new createjs.Text("W == Thrust / SpaceBar == Fire", "bold 52px airone", "");
        _txtInsturctions.color = "#ffffff";
        _txtInsturctions = widthAdjust(_txtInsturctions);
        stage.addChild(_txtInsturctions);
        _txtCountDown = new createjs.Text("5", "bold 400px airone", "");
        _txtCountDown.color = "#ffffff";
        _txtCountDown = widthAdjust(_txtCountDown);
        _txtCountDown.y = (_txtWelcome.y - 20);
        stage.addChild(_txtCountDown);
        _introStartUp.push(_txtCountDown);
        //_txtStart.y = (_txtInsturctions.y + 140);
        _introStartUp.push(_txtInsturctions);
        _txtStart.y = stage.height - 100;
        stage.addChild(_txtStart);
        _txtInsturctions.y = _txtCountDown.y + (_txtCountDown.getBounds().height + 40);
        var CountDown = setInterval(function() {
            if (parseInt(_txtCountDown.text) != 0) {
                if (parseInt(_txtCountDown.text) == 4) {
                    _txtStart.text = "too Be.."
                    _txtStart = widthAdjust(_txtStart);
                    //_txtStart.y = (stage.height - _txtStart.getTransformedBounds().height) / 2;
                }
                if (parseInt(_txtCountDown.text) == 2) {
                    _txtStart.text = "Blasted"
                    _txtStart = widthAdjust(_txtStart);
                    //_txtStart.y = (stage.height - _txtStart.getTransformedBounds().height) / 2;
                }
                _txtCountDown.text = parseInt(_txtCountDown.text) - 1;
            } else {
                ppReset();
                clearInterval(CountDown);
                delete CountDown;
            }
        }, 1000);

        /*bg = new createjs.Shape();
        stage.addChild(bg);
        bg.x = 0;
        bg.y = 0;
        bg.graphics.beginBitmapFill(evt.target, 'repeat').drawRect(0, 0, canvas.width, canvas.height);
        var blurFilter = new createjs.BlurFilter(4, 4, 1);
        bg.alpha = 0.5;
        bg.filters = [blurFilter];
        bg.cache(0, 0, canvas.width, canvas.height);
        */
    }


}

function widthAdjust(_txt) {
    if (_txt.getBounds().width > (_width * 0.4)) {
        _txt.scaleY = _txt.scaleX = ((_width * 0.4) / _txt.getBounds().width);
        setTimeout(function() {
            _txt.x = ((stage.width - _txt.getTransformedBounds().width) / 2);
            simpleFade(_txt);
        }, 500);
    }
    setTimeout(function() {
        _txt.x = ((stage.width - _txt.getTransformedBounds().width) / 2);
        simpleFade(_txt);
    }, 500);
    _txt.alpha = 0;
    _txt.shadow = new createjs.Shadow("#00a7f7", _xOffset, _yOffset, 20);
    return _txt;
}

function simpleFade(obj) {
    createjs.Tween.get(obj).to({
        alpha: 1
    }, 400);

}

function gameOverGui() {
    var i;
    for (i = stage.children.length - 1; i >= 0; i--) {
        stage.removeChild(stage.children[i]);
    }
    _txtGameOver = new createjs.Text("Game Over", "bold 42px airone", "");
    _txtReplay = new createjs.Text(" Enter to replay", "bold 42px airone", "");

    _txtGameOver.color = _txtReplay.color = "#00a7f7";
    stage.addChild(_txtGameOver);
    _txtGameOver = widthAdjust(_txtGameOver);
    _txtGameOver.y = (_height - _txtGameOver.getBounds().height) / 2;

    _txtReplay = widthAdjust(_txtReplay);
    _txtReplay.y = _txtGameOver.y + 50;
    stage.addChild(_txtReplay);

    stage.addChild(_txtGameOver);
}

function GUI() {
    for (var i = 0; i < _introStartUp.length; i++) {
        stage.removeChild(_introStartUp[i]);
        _introStartUp[i] = null;
    }
    _initGame = true;
    var cimg = new Image();
    cimg.src = "images/cockpit.png";
    cimg.onload = function(evt) {
        var cpOrigWidth = 1366;
        cpOrigHeight = 543;
        cockpit = new createjs.Bitmap(evt.target);
        stage.addChild(cockpit);
        _cpScale = (_height / cpOrigHeight);
        cockpit.scaleX = _cpScale;
        cockpit.scaleY = _cpScale;
        cpBounds = cockpit.getBounds();
        cockpit.x = (stage.width - (cpBounds.width * _cpScale)) / 2;
        cockpit.y = (stage.height - (cpBounds.height * _cpScale)) / 2;
        _txtScore = new createjs.Text("Score: " + _Score, "bold 20px airone", "");
        _txtScore.color = "#00a7f7";
        _txtScore.x = 20;
        _txtScore.y = 20;

        _txtScore.shadow = new createjs.Shadow("#00a7f7", _xOffset, _yOffset, 10);
        var img = new Image();
        img.src = "images/shipIco.png";
        img.onload = function(evt) {
            shipIco = new createjs.Bitmap(evt.target);
            stage.addChild(shipIco);
            shipIco.scaleX = 0.2;
            shipIco.scaleY = 0.2;
            var sBounds = shipIco.getBounds();
            shipIco.x = (stage.width - 80)
            shipIco.y = 20;
            _txtLives = new createjs.Text("X " + _lives + ":", "bold 20px airone", "");
            _txtLives.color = "#ff1a00";
            _txtLives.shadow = new createjs.Shadow("#ff1a00", _xOffset, _yOffset, 10);
            _txtLives.x = (stage.width - 140);
            _txtLives.y = 35;
            HealthBar = new createjs.Shape();
            DamageBar = new createjs.Shape();
            var yLoc = _txtLives.y + 40;
            HealthBar.graphics.beginStroke("#ff1a00").beginLinearGradientFill(["#00a7f7", "#0A2354"], [0, 1], 0, yLoc, 0, yLoc + 10).drawRect(_txtLives.x, yLoc, 100, 10);
            var yLoc = _txtLives.y + 40;
            DamageBar.yLoc = yLoc;
            DamageBar.xLoc = _txtLives.x;
            DamageBar.setBounds(DamageBar.xLoc, yLoc, 100, 10);
            DamageBar.graphics.beginLinearGradientFill(["#ff3019", "#cf0404"], [0, 1], 0, yLoc, 0, yLoc + 10).drawRect(_txtLives.x, yLoc, 100, 10);

            DamageBar.setTransform(0, 0, 0, 1);

            //DamageBar.x = _txtLives.x;
            //DamageBar.y = yLoc;
            stage.addChild(HealthBar);
            stage.addChild(DamageBar);
            stage.addChild(_txtLives);

        }
        stage.addChild(_txtScore);


    }


    healtHit = function(scaleX) {
        DamageBar.scaleX = scaleX;
        DamageBar.setTransform(0, 0, scaleX, 1);
        DamageBar.x = (DamageBar.xLoc - DamageBar.getTransformedBounds().x + (100 - DamageBar.getTransformedBounds().width));
    }

    this.updateLives = function() {
        try {
            _txtLives.text = "Score: " + score;
        } catch (e) {

        }

    }

    //var _sc = this._txtScore;
    this.update = function(score) {
        try {
            _txtScore.text = "Score: " + score;
        } catch (e) {

        }

    }
    return this;
}
/**
 * Created by ansingh on 8/19/2015.
 */
define(function (require, exports, module) {

    require('jquery');
    var React = require('react');
    var Block = require("./Block.react");

    var imgs = {
        snakeHeadBlock: "",
        snakeBodyBlock: "",
        snakeTailBlock: ""
    };

    var allBlocks, snakeHeadAtDirChange=null;

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    var Snake = React.createClass({displayName: "Snake",

    getDefaultProps: function() {
        return {
            fParentPath : '/'
        };
    },

    fillAllBlocks: function() {
        allBlocks = [];
        for(var i=0; i<this.props.pBoardStartSize*this.props.pBoardStartSize; i++)
            allBlocks.push(i);
    },

    getRandomFoodPosition: function(alreadyUsed) {

        if(allBlocks === undefined)
            this.fillAllBlocks();

        var remainingBlocks = allBlocks.diff(alreadyUsed);

        return remainingBlocks[Math.floor((Math.random() * remainingBlocks.length))];
    },

    getInitialState: function() {
        
        var headLoc = (this.props.pBoardStartSize*(1+this.props.pBoardStartSize))/2,
            capturedBlocks = [];

        for(var i=0; i<this.props.pSnakeStartSize; i++)
            capturedBlocks.push(headLoc+i);

        var randomFoodPosition = this.getRandomFoodPosition(capturedBlocks);

        return {
            sSnakeDirection : 2,
            sSnakeHeadPosition : headLoc,
            sSnakeCapturedBlocks : capturedBlocks,
            sFoodPosition : randomFoodPosition
        };
    },

    SnakeHeadOnEdge: function(){

        var sz  = this.props.pBoardStartSize,
            pos = this.state.sSnakeHeadPosition,
            result = "";

        var top         = false,
            bottom      = false,
            left        = false,
            right       = false,
            topleft     = false,
            topright    = false,
            bottomleft  = false,
            bottomright = false;

        if(pos >=0 && pos<sz)
            top = true;
        if(pos<sz*sz && pos>=sz*(sz-1))
            bottom = true;
        if(pos%sz === 0)
            left = true;
        if(pos%sz === sz-1)
            right = true;
    
        if(top && left)
            result = "topleft";
        else if(top && right)
            result = "topright";
        else if(bottom && left)
            result = "bottomleft";
        else if(bottom && right)
            result = "bottomright";
        else if(top)
            result = "top";
        else if(bottom)
            result = "bottom";
        else if(left)
            result = "left";
        else if(right)
            result = "right";

        return result;
    },

    moveSnake: function() {

        var headPos,
            edgePosition = this.SnakeHeadOnEdge();

        if(this.state.sSnakeDirection == 0)
        {
            headPos = this.state.sSnakeHeadPosition+1;
            if(edgePosition === "right" || edgePosition === "topright" || edgePosition === "bottomright")
                headPos -= this.props.pBoardStartSize;
        }
        else if(this.state.sSnakeDirection == 1)
        {
            headPos = this.state.sSnakeHeadPosition-this.props.pBoardStartSize;
            if(edgePosition === "top" || edgePosition === "topright" || edgePosition === "topleft")
                headPos += this.props.pBoardStartSize*this.props.pBoardStartSize;
        }
        else if(this.state.sSnakeDirection == 2)
        {
            headPos = this.state.sSnakeHeadPosition-1;
            if(edgePosition === "left" || edgePosition === "topleft" || edgePosition === "bottomleft")
                headPos += this.props.pBoardStartSize;
        }
        else if(this.state.sSnakeDirection == 3)
        {   
            headPos = this.state.sSnakeHeadPosition+this.props.pBoardStartSize;
            if(edgePosition === "bottom" || edgePosition === "bottomright" || edgePosition === "bottomleft")
                headPos -= this.props.pBoardStartSize*this.props.pBoardStartSize;
        }

        var capturedBlocks = this.state.sSnakeCapturedBlocks;

        if(capturedBlocks.indexOf(headPos) !== -1)
        {
            $(this.refs.blockContainer.getDOMNode()).addClass("hide");
                   
            if(capturedBlocks.length < this.props.pBoardStartSize*this.props.pBoardStartSize)
                $(this.refs.SnakeWorld.getDOMNode()).find('.lose').removeClass("hide");
            else
                $(this.refs.SnakeWorld.getDOMNode()).find('.win').removeClass("hide");
            
            $(this.refs.SnakeWorld.getDOMNode()).find('.score').html(capturedBlocks.length+"/"+this.props.pBoardStartSize*this.props.pBoardStartSize);
            $(this.refs.SnakeWorld.getDOMNode()).find('.score').removeClass("hide");
            return;
        }

        capturedBlocks.unshift(headPos);
    
        if(headPos == this.state.sFoodPosition)
        {
            this.setState({ sFoodPosition: this.getRandomFoodPosition(capturedBlocks),
                            sSnakeHeadPosition: headPos, 
                            sSnakeCapturedBlocks: capturedBlocks});
        }    
        else{
            capturedBlocks.pop();
            this.setState({ sSnakeHeadPosition: headPos, 
                            sSnakeCapturedBlocks: capturedBlocks});
        }
        setTimeout(this.moveSnake, this.props.pSnakeSpeed);        
    },

    handleKeyPress: function(e){

        if(this.state.sSnakeHeadPosition == snakeHeadAtDirChange)
            return;

        snakeHeadAtDirChange = null;

        var code = parseInt(e.which || e.keyCode);

        if(code == 37){
            if(this.state.sSnakeDirection != 0 && this.state.sSnakeDirection != 2){
                this.setState({sSnakeDirection: 2}, this.resetChangingDirection);
            }    
        }
        else if(code == 38){
            if(this.state.sSnakeDirection != 3 && this.state.sSnakeDirection != 1){
                this.setState({sSnakeDirection: 1}, this.resetChangingDirection);
            }
        }
        
        else if(code == 39){    
            if(this.state.sSnakeDirection != 2 && this.state.sSnakeDirection != 0){
                this.setState({sSnakeDirection: 0}, this.resetChangingDirection);
            }
        }
        else if(code == 40){
            if(this.state.sSnakeDirection != 1 && this.state.sSnakeDirection != 3){
                this.setState({sSnakeDirection: 3}, this.resetChangingDirection);
            }                        
        }

        snakeHeadAtDirChange = this.state.sSnakeHeadPosition;
    },

    componentDidMount: function() {

        window.addEventListener("keydown", this.handleKeyPress, false);
        this.moveSnake();
    },

    propTypes: {
        fParentPath: React.PropTypes.string.isRequired
    },

    getBlock: function(xCord, yCord) {

        var blockKey = this.props.pBoardStartSize * xCord + yCord,
            snakeLen = this.state.sSnakeCapturedBlocks.length;

        return (React.createElement(Block, {key: blockKey, 
                        pxCord: xCord, 
                        pyCord: yCord, 
                        pBlockKey: blockKey, 
                        pDirection: this.state.sSnakeDirection, 
                        pIsHead: this.state.sSnakeCapturedBlocks.indexOf(blockKey) ===  0 ? true  : false, 
                        pIsBody: this.state.sSnakeCapturedBlocks.indexOf(blockKey) !== -1 ? true : false, 
                        pIsTail: this.state.sSnakeCapturedBlocks.indexOf(blockKey) === snakeLen-1 ? true : false, 
                        pIsFood: blockKey === this.state.sFoodPosition ? true : false})
            );
    },

    getBlocks : function() {

        var blocks = [];

        for(var i=0; i<this.props.pBoardStartSize; i++)
            for(var j=0; j<this.props.pBoardStartSize; j++)
                blocks.push(this.getBlock(i, j));

        return (React.createElement("div", {className: "blockContainer", ref: "blockContainer"}, blocks));
    }, 

    getStyle: function() {
        
        var delta = 0.1;

        return {
            'borderStyle': 'solid',
            'borderColor': 'magenta',
            'borderRadius': '0.1rem',
            'width': (delta+this.props.pBoardStartSize).toString() + "rem",
            'height': (delta+this.props.pBoardStartSize).toString() + "rem"
        };
    },

    render: function() {
        return (
            React.createElement("div", {className: "SnakeWorld", ref: "SnakeWorld", style: this.getStyle()}, 
                this.getBlocks(), 
                React.createElement("div", {className: "win hide"}, "YOU WIN!"), 
                React.createElement("div", {className: "lose hide"}, "YOU LOSE!"), 
                React.createElement("div", {className: "score hide"})
            )
        );
    },

    });

    module.exports = Snake;
});
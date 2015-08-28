/**
 * Created by ansingh on 8/19/2015.
 */

define(function (require, exports, module) {

    require('jquery');
    var React = require('react');

    var Block = React.createClass({displayName: "Block",

        getDefaultProps: function () {
            return {};
        },

        getInitialState: function () {
            return {};
        },

        propTypes: {
        },

        getPositioningStyle: function (){

            return {
                'left': (this.props.pyCord).toString()+"rem",
                'top' : (this.props.pxCord).toString()+"rem"
            };
        },

        render: function () {
            
            if(this.props.pIsFood)
                return (React.createElement("div", {className: "block food", ref: "foodBlock", id: this.props.pBlockKey, style: this.getPositioningStyle()}));                

            else if(this.props.pIsHead)
                return (React.createElement("div", {className: "block shead", ref: "snakeBlock", id: this.props.pBlockKey, style: this.getPositioningStyle()}));

            else if(this.props.pIsTail)
                return (React.createElement("div", {className: "block stail", ref: "snakeBlock", id: this.props.pBlockKey, style: this.getPositioningStyle()}));

            else if(this.props.pIsBody)
                return (React.createElement("div", {className: "block sbody", ref: "snakeBlock", id: this.props.pBlockKey, style: this.getPositioningStyle()}));

            else
                return (React.createElement("div", {className: "block sempty", ref: "block", id: this.props.pBlockKey, style: this.getPositioningStyle()}));
        }
    });

    module.exports = Block;
});
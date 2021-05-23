(()=>{"use strict";var t,r={570:(t,r,e)=>{var i=e(601),n=function(){function t(t,r){if("number"!=typeof t||isNaN(t)||"number"!=typeof r||isNaN(r))throw new Error("en.Position.invalid");this.x=t,this.y=r,Object.freeze(this)}return t.parse=function(r){if(!r)return null;try{return new t(r.x,r.y)}catch(t){return console.error("D3O_RewardBoard invalid position:",r),console.error(t),null}},t.prototype.toCoords=function(){return{x:this.x,y:this.y}},t.prototype.distance=function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)},t.prototype.isOnBoard=function(){var t=0===this.x,r=0===this.y;if(t&&r)return!0;var e=Math.abs(this.x),n=Math.abs(this.y);if(t||r)return(t?n:e)<=i.RIMS_LEVELS*i.RIM_STEPS-i.RIM_STEPS+i.RIM_LAS_LEVEL_STEPS;if(e%i.RIM_STEPS==0||n%i.RIM_STEPS==0){var s=[e,n].sort((function(t,r){return t-r})),o=s[0],S=s[1],a=S%i.RIM_STEPS==0,u=a?S/i.RIM_STEPS:o/i.RIM_STEPS;return!(u>i.RIMS_LEVELS)&&(a?o:S)<=u*i.RIM_STEPS}return!1},t.prototype.possibleSteps=function(){return{up:this.step("up").isOnBoard(),right:this.step("right").isOnBoard(),down:this.step("down").isOnBoard(),left:this.step("left").isOnBoard()}},t.prototype.step=function(r){switch(r){case"up":return new t(this.x,this.y-1);case"right":return new t(this.x+1,this.y);case"down":return new t(this.x,this.y+1);case"left":return new t(this.x-1,this.y)}},t}();r.default=n},601:(t,r)=>{function e(t,e){r.mapTiles.push({x:t,y:e})}Object.defineProperty(r,"__esModule",{value:!0}),r.mapTiles=r.RIM_LAS_LEVEL_STEPS=r.RIM_STEPS=r.RIMS_LEVELS=void 0,r.RIMS_LEVELS=4,r.RIM_STEPS=3,r.RIM_LAS_LEVEL_STEPS=8,r.mapTiles=[],e(0,0);for(var i=r.RIMS_LEVELS*r.RIM_STEPS+r.RIM_LAS_LEVEL_STEPS-r.RIM_STEPS,n=-i;n<=i;n+=1)0!==n&&(e(n,0),e(0,n));for(var s=0;s<r.RIMS_LEVELS;s+=1){var o=s*r.RIM_STEPS+r.RIM_STEPS;for(n=-o;n<o;n+=1)0!==n&&(e(n,-o),e(o,n),e(n,o),e(-o,n));e(o,-o),e(o,o),e(-o,o),e(-o,-o)}}},e={};t=function t(i){var n=e[i];if(void 0!==n)return n.exports;var s=e[i]={exports:{}};return r[i](s,s.exports,t),s.exports}(570),globalThis.Position=t.default})();
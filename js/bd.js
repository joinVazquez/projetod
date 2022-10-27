

<!DOCTYPE html>
<html lang="en" >

<head>

  <meta charset="UTF-8">
  

  <title>Banco de dados do nosso siste</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">

  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.2/angular-material.min.css'>
  
<style>
md-input-container {
  margin: 0;
}

md-input-container .md-errors-spacer {
  min-height: 0 !important;
  height: 0 !important;
}

gs-magnet {
  padding: 6px 10px;
  position: absolute;
  display: block;
  border-radius: 3px;
  background: #fafafa;
  color: #212121;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
}

.board {
  width: 800px;
  height: 500px;
  position: relative;
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.instructions {
  margin: 0;
  padding: 0 1em;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.54);
}

.instructions li {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  margin: 0;
  line-height: 1.6em;
}

.info-content,
.connecting-content {
  width: 800px;
}

.viewers {
  font-size: 16px;
  font-weight: 400;
}

.viewers ng-md-icon {
  margin-left: 8px;
}
</style>

  <script>
  window.console = window.console || function(t) {};
</script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>

  
  <script>
  if (document.location.search.match(/type=embed/gi)) {
    window.parent.postMessage("resize", "*");
  }
</script>


</head>

<body translate="no" >
  <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.1/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.1/angular-animate.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.1/angular-aria.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.1/angular-sanitize.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.2/angular-material.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.6.0/angular-material-icons.min.js"></script>
<script src="//cdn.firebase.com/js/client/2.3.2/firebase.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angularFire/1.1.3/angularfire.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenMax.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/utils/Draggable.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.0/lodash.min.js"></script>

<body ng-app="magnetGame" ng-cloak>

  <md-toolbar class="md-whiteframe-1dp">
    <div class="md-toolbar-tools">
      <h2>
        <span>Real-time Fridge Magnets</span>
      </h2>
      <span flex></span>      
      <div class="viewers" layout="row">
        <md-tooltip md-direction="bottom">
          Users Online
        </md-tooltip>
<!--         <div layout-align="center center" layout="column">
          {{viewers || 0}} 
        </div>
        <div layout-align="center center" layout="column">
          <ng-md-icon icon="people" style="fill: white" size="24"></ng-md-icon> 
        </div>        -->
      </div>      
    </div>   
  </md-toolbar>

  <md-content class="connecting-content md-whiteframe-2dp" ng-if="!(loggedIn && loaded)" layout-padding layout-margin>
    <h1 class="md-title">Connecting...</h1>
  </md-content>

  <section ng-controller="MainController as vm" ng-if="loggedIn && loaded" layout="column" layout-margin>
    
    <md-content class="info-content md-whiteframe-2dp" layout="column" layout-padding>
            
      <div>
        <ul class="instructions">
          <li>View this page in another browser window :)</li>
          <li>Moves are synced across all connected clients</li>
          <li>Drag a magnet off the board to remove</li>
        </ul>
      </div>
      
      <div>
        <form ng-submit="vm.addWords()">
          <md-input-container md-no-float>
            <input ng-model="vm.magnet" maxlength="25" placeholder="Add magnets...">
          </md-input-container>
        </form>
      </div>
            
    </md-content>
    
    <section class="board md-whiteframe-2dp">      
        <gs-magnet class="magnet-animation" 
                   ng-repeat="magnet in vm.magnets track by magnet.id" 
                   ng-class="{locked: magnet.locked}" 
                   magnet-id="{{magnet.id}}" 
                   update-draggable="vm.updateDraggable()"
                   update-board="vm.updateBoard()">
        </gs-magnet>
    </section>    
  </section>
</body>
    <script src="https://cpwebassets.codepen.io/assets/common/stopExecutionOnTimeout-2c7831bb44f98c1391d6a4ffda0e1fd302503391ca806e7fcc7b9b87197aec26.js"></script>

  
      <script id="rendered-js" >
"use strict";
console.clear();
var log = console.log.bind(console);
var MagnetGame;
(function (MagnetGame) {
    "use strict";
    const firebaseApp = "magnet-game-1";
    //
    // START FIREBASE
    // ========================================================================
    function startFirebase($rootScope, firebaseData, Viewers) {
        $rootScope.authData = null;
        $rootScope.error = null;
        $rootScope.loaded = false;
        $rootScope.loggedIn = false;
        firebaseData.auth.$onAuth(authData => {
            $rootScope.authData = authData;
            $rootScope.loggedIn = !!authData;
        });
        firebaseData.auth.$authAnonymously();
        firebaseData.magnetsRef.once("value", () => $rootScope.loaded = true);
    }
    //
    // MAIN CONTROLLER
    // ========================================================================
    class MainController {
        // TODO: Create a magnet service
        constructor($rootScope, $sanitize, $timeout, firebaseData) {
            this.$rootScope = $rootScope;
            this.$sanitize = $sanitize;
            this.$timeout = $timeout;
            this.firebaseData = firebaseData;
            this.magnet = "";
            this.magnets = [];
            this.addWords = _.throttle(this.addMagnet.bind(this), 1000);
            this.magnetsRef = this.firebaseData.magnetsRef;
            this.words = [
                "how are you doing",
                "where are you from",
                "tell me a joke"
            ];
            this.magnetsRef.on("value", this.onChange.bind(this));
            this.updateBoard();
        }
        onChange(snapshot) {
            this.magnets = _.reduce(snapshot.val(), (result, value, key) => {
                result.push(_.assign({}, { id: key }, value));
                return result;
            }, []);
            this.$timeout();
        }
        addMagnet() {
            if (!this.magnet || !_.isString(this.magnet))
                return;
            this.updateDraggable();
            var string = this.$sanitize(this.magnet);
            var words = _.uniq(_.words(string));
            words.forEach((word, i) => {
                this.$timeout(() => {
                    this.magnetsRef.ref().push({
                        x: _.random(50, 600, true),
                        y: _.random(50, 400, true),
                        rotation: _.random(-8, 8, true),
                        zIndex: Draggable.zIndex++,
                        locked: false,
                        content: _.escapeRegExp(_.escape(word)),
                        user: this.$rootScope.authData.uid,
                        date: Date.now(),
                        // created: Firebase.ServerValue.TIMESTAMP,
                    }, error => {
                        if (error)
                            console.log(error);
                    });
                }, (i + 1) * 50);
                this.magnet = "";
            });
        }
        updateBoard() {
            if (!this.magnets.length) {
                this.magnet = _.sample(this.words);
                this.addMagnet();
            }
        }
        updateDraggable() {
            Draggable.zIndex = 1000;
            this.magnets.forEach(magnet => {
                var zIndex = magnet.zIndex * 1;
                if (zIndex >= Draggable.zIndex)
                    Draggable.zIndex = zIndex + 1;
            });
        }
    }
    //
    // VIEWERS
    // ========================================================================
    class Viewers {
        constructor($rootScope, firebaseData) {
            this.$rootScope = $rootScope;
            this.firebaseData = firebaseData;
            this.connectedRef = firebaseData.connectedRef;
            this.viewersRef = firebaseData.viewersRef;
            this.viewersRef.once("value", snapshot => {
                _.forOwn(snapshot.val(), timestamp => {
                    console.info("VIEWER:", new Date(timestamp));
                });
            });
            this.connectedRef.on("value", this.onConnection.bind(this));
            this.viewersRef.on("value", this.onViewersChange.bind(this));
        }
        onConnection(snapshot) {
            if (snapshot.val() === true) {
                var viewerRef = this.viewersRef.push(Firebase.ServerValue.TIMESTAMP);
                viewerRef.onDisconnect().remove();
            }
        }
        onViewersChange(snapshot) {
            this.$rootScope.$apply(() => {
                this.$rootScope.viewers = snapshot.numChildren();
            });
        }
    }
    //
    // MAGNET CONTROLLER
    // ========================================================================
    class MagnetController {
        constructor($element, $scope, $timeout, firebaseData) {
            this.$element = $element;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.firebaseData = firebaseData;
            this.active = false;
            this.time = 0;
            this.board = document.querySelector(".board");
            this.data = this.firebaseData.magnet(this.magnetId);
            this.unwatch = this.data.$watch(this.onChange.bind(this));
            this.draggable = null;
            this.data.$loaded(event => {
                if (!this.data.content || !this.data.zIndex) {
                    TweenLite.set($element, { autoAlpha: 0 });
                    this.remove();
                    return;
                }
                this.init();
            });
            this.data.$ref().onDisconnect().update({ locked: false });
        }
        init() {
            this.draggable = new Draggable(this.$element, {
                onDrag: this.onDrag,
                onPress: this.onPress,
                onRelease: this.onRelease,
                zIndexBoost: false,
                callbackScope: this,
                liveSnap: {
                    x: n => this.active ? n : this.data.x,
                    y: n => this.active ? n : this.data.y
                }
            });
        }
        onChange(event) {
            var config = {
                rotation: this.data.rotation,
                zIndex: this.data.zIndex || Draggable.zIndex
            };
            if (!this.active) {
                config.x = this.data.x;
                config.y = this.data.y;
            }
            TweenLite.to(this.$element, this.time, config);
            this.time = 0.07;
        }
        onPress(event) {
            if (this.data.locked)
                return;
            this.draggable.update();
            this.updateDraggable();
            this.active = true;
            this.data.locked = true;
            this.data.zIndex = Draggable.zIndex++;
            this.data.$save();
        }
        onRelease(event) {
            if (!this.draggable.hitTest(this.board)) {
                this.remove();
                return;
            }
            if (!this.active)
                return;
            this.active = false;
            this.data.locked = false;
            this.data.$save();
        }
        onDrag(event) {
            if (!this.active)
                return;
            this.data.x = this.draggable.x;
            this.data.y = this.draggable.y;
            this.data.$save();
        }
        remove() {
            this.draggable && this.draggable.kill();
            this.unwatch();
            this.data.$remove().then(ref => {
                this.$scope.$destroy();
                this.updateBoard();
            }, error => {
                console.log(error);
            });
        }
    }
    //
    // MAGNET COMPONENT
    // ========================================================================
    var magnetComponent = {
        template: `<div class="magnet-inner" ng-bind-html="$ctrl.data.content"></div>`,
        controller: MagnetController,
        bindings: {
            updateDraggable: "&",
            updateBoard: "&",
            magnetId: "@"
        }
    };
    //
    // MAGNET ANIMATION
    // ========================================================================
    function magnetAnimation() {
        return {
            enter: (element, done) => {
                TweenLite.from(element, 0.35, { autoAlpha: 0, scale: 0.5, x: 0, y: 0, onComplete: done });
            },
            leave: (element, done) => {
                TweenLite.to(element, 0.1, { autoAlpha: 0, scale: 0.5, onComplete: done });
            },
            addClass: (element, className, done) => {
                if (className === "locked") {
                    TweenLite.to(element, 0.25, { backgroundColor: "rgb(163,233,164)", onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: (element, className, done) => {
                if (className === "locked") {
                    TweenLite.to(element, 0.25, { backgroundColor: "rgb(250,250,250)", onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    }
    //
    // FIREBASE DATA
    // ========================================================================
    class FirebaseData {
        constructor($firebaseAuth, $firebaseArray, $firebaseObject, firebaseUtils, firebaseUrl) {
            this.$firebaseAuth = $firebaseAuth;
            this.$firebaseArray = $firebaseArray;
            this.$firebaseObject = $firebaseObject;
            this.firebaseUtils = firebaseUtils;
            this.firebaseUrl = firebaseUrl;
            this.maxMagnets = 100;
            this.rootRef = this.firebaseUtils.ref();
            this.magnetsRef = this.firebaseUtils.ref("magnets").limitToLast(75);
            this.auth = this.$firebaseAuth(this.rootRef);
            this.connectedRef = firebaseUtils.ref(".info/connected");
            this.viewersRef = firebaseUtils.ref("viewers");
            // Prune the list
            var magnets = $firebaseArray(this.magnetsRef.ref());
            magnets.$loaded(event => {
                _.forEachRight(magnets, (magnet, i) => {
                    if (i > this.maxMagnets) {
                        magnets.$remove(magnet);
                    }
                });
                console.info("MAGNETS:", magnets.length);
            });
        }
        magnet(id) {
            var ref = this.firebaseUtils.ref("magnets", id);
            return this.$firebaseObject(ref);
        }
    }
    //
    // FIREBASE UTILS
    // ========================================================================
    class FirebaseUtils {
        constructor($q, $window, firebaseUrl) {
            this.$q = $q;
            this.$window = $window;
            this.firebaseUrl = firebaseUrl;
        }
        get timestamp() { return Firebase.ServerValue.TIMESTAMP; }
        handler(fn, context) {
            return this.defer(def => {
                fn.call(context, (err, result) => {
                    if (err !== null) {
                        def.reject(err);
                    }
                    else {
                        def.resolve(result);
                    }
                });
            });
        }
        defer(fn, context) {
            var def = this.$q.defer();
            fn.call(context, def);
            return def.promise;
        }
        pathRef(paths) {
            _.forEach(paths, (path, i) => {
                if (_.isArray(path)) {
                    path = this.pathRef(path);
                }
                else if (!_.isString(path)) {
                    throw new Error(`Argument ${i} to firebaseRef is not a string: ${path}`);
                }
            });
            return paths.join("/");
        }
        ref(...paths) {
            var ref = new this.$window.Firebase(this.firebaseUrl);
            if (paths.length) {
                ref = ref.child(this.pathRef(paths));
            }
            return ref;
        }
    }
    angular
        .module("magnetGame", ["firebase", "ngMaterial", "ngSanitize", "ngMdIcons"])
        .run(startFirebase)
        .constant("firebaseUrl", `https://${firebaseApp}.firebaseIO.com`)
        .controller("MainController", MainController)
        .component("gsMagnet", magnetComponent)
        .service("firebaseData", FirebaseData)
        .service("firebaseUtils", FirebaseUtils)
        .service("Viewers", Viewers)
        .animation(".magnet-animation", magnetAnimation);
})(MagnetGame || (MagnetGame = {}));
//# sourceURL=pen.js
    </script>

  

</body>

</html>
 

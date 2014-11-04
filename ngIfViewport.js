angular.module('ngIfViewport', []).directive('ifViewport', ['$animate', '$window', function($animate, $window) {
    return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        $$tlb: true,
        link: function($scope, $element, $attr, ctrl, $transclude) {

            var alias = $attr.ifViewport;

            if(angular.element('.device-' + alias).length == 0){
                angular.element('body').append('<div class="device-'+alias+' visible-'+alias+'">');
            }

            var init = $window.onresize = function ifViewportInit() {
                    ifViewportWatchAction($('.device-' + alias).is(':visible'));
            };

            init();

            var block, childScope, previousElements;

            function getBlockNodes(nodes) {
                // TODO(perf): just check if all items in `nodes` are siblings and if they are return the original
                //             collection, otherwise update the original collection.
                var node = nodes[0];
                var endNode = nodes[nodes.length - 1];
                var blockNodes = [node];

                do {
                    node = node.nextSibling;
                    if (!node) break;
                    blockNodes.push(node);
                } while (node !== endNode);

                return $(blockNodes);
            }

            function ifViewportWatchAction(visible) {
                if (visible) {
                    if (!childScope) {
                        $transclude(function(clone, newScope) {
                            childScope = newScope;
                            clone[clone.length++] = document.createComment(' end ifViewport: ' + $attr.ifViewport + ' ');
                            // Note: We only need the first/last node of the cloned nodes.
                            // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                            // by a directive with templateUrl when its template arrives.
                            block = {
                                clone: clone
                            };
                            $animate.enter(clone, $element.parent(), $element);
                        });
                    }
                } else {
                    if (previousElements) {
                        previousElements.remove();
                        previousElements = null;
                    }
                    if (childScope) {
                        childScope.$destroy();
                        childScope = null;
                    }
                    if (block) {
                        previousElements = getBlockNodes(block.clone);
                        $animate.leave(previousElements).then(function() {
                            previousElements = null;
                        });
                        block = null;
                    }
                }

            }
        }
    };
}]);

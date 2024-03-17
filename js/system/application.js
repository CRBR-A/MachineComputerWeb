//code pour créer de multiples instances (principalement GUI)


//return instances
var application = function (selector, parameter) {
    'use strict';
    var elements,
        createInstance,
        instances = [],
        i;

    application.prototype = application.init.prototype;

    createInstance = function (element) {
        if (element._application) {
            element._application.destroy();
        }
        element._application = new application.init(element, parameter);
        return element._application;
    };

    if (selector.nodeName) {
        return createInstance(selector);
    }

    elements = application.prototype.querySelectorAll(selector);

    if (elements.length === 1) {
        return createInstance(elements[0]);
    }

    for (i = 0; i < elements.length; i++) {
        instances.push(createInstance(elements[i]));
    }
    return instances;
};

/**
 * @constructor
 */
application.init = function (file_url) {
    'use strict';
    var self = this;

    /*
    open = function () {
        self.addEventListener(document, 'click', documentClick, false);
        self.addClass(wrapperElement, 'open');
    };

    close = function () {
        self.removeEventListener(document, 'click', documentClick, false);
        self.removeClass(wrapperElement, 'open');
    };
    */

    destroy = function () {
        var parent,
            element;

        //GUI : 
        //self.removeEventListener(document, 'click', documentClick, false);
        //self.removeEventListener(self.element, 'focus', open, false);
        //self.removeEventListener(self.element, 'blur', close, false);
        //self.removeEventListener(self.element, 'click', open, false);

        parent = self.element.parentNode;
        parent.removeChild(calendarContainer);
        //GUI : element = parent.removeChild(self.element);
        parent.parentNode.replaceChild(element, parent);
    };
    
    init = function () {
        var config;

        self.destroy = destroy;

        self.element = element;
    };

    init();

    return self;
};


application.init.prototype = {
  hasClass: function (element, className) { return element.classList.contains(className); },
  addClass: function (element, className) { element.classList.add(className); },
  removeClass: function (element, className) { element.classList.remove(className); },
  forEach: function (items, callback) { [].forEach.call(items, callback); },
  querySelectorAll: document.querySelectorAll.bind(document),
  isArray: Array.isArray,
  addEventListener: function (element, type, listener, useCapture) {
      element.addEventListener(type, listener, useCapture);
  },
  removeEventListener: function (element, type, listener, useCapture) {
      element.removeEventListener(type, listener, useCapture);
  }
};
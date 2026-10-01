// Bubble element "Yatmo Map": paste `initialize` and `update` into the element's code editor.
// Renders <yatmo-map> (the Yatmo iframe plugin) from the element's properties; the web components come from
// the shared header (https://cdn.jsdelivr.net/npm/@yatmo/elements@1/dist/yatmo-elements.js).

function(instance, context) {
  // initialize
  instance.data.last = '';
  instance.canvas.css({ overflow: 'hidden' });
  var host = document.createElement('div');
  host.style.cssText = 'width:100%;height:100%';
  instance.canvas.append(host);
  instance.data.host = host;
  instance.data.ready = (window.customElements && customElements.whenDefined) ? customElements.whenDefined('yatmo-map').then(function () { return true; }).catch(function () { return false; }) : Promise.resolve(true);
}

function(instance, properties, context) {
  // update
  // The key: the element's field, else the plugin key set once in the app's Plugins tab (Additional keys).
  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var attr = function (name, value) { return (value === undefined || value === null || value === '' || value === 'off') ? '' : ' ' + name + '="' + esc(value) + '"'; };
  var location = (properties.latitude !== undefined && properties.longitude !== undefined && properties.latitude !== null && properties.longitude !== null)
    ? attr('latitude', properties.latitude) + attr('longitude', properties.longitude)
    : attr('address', properties.address);
  var marker = properties.marker || 'pin';
  var html = '<yatmo-map' + attr('key', properties.license_key || (context.keys && context.keys.license_key) || '') + attr('country', properties.country || 'BE') + attr('language', properties.language || 'EN') + location
    + attr('mode', properties.mode) + attr('zoom', properties.zoom) + attr('map-style', properties.map_style) + attr('accent-color', properties.accent_color)
    + attr('marker', marker) + (marker === 'circle' ? attr('circle-radius', properties.circle_radius || 300) : '') + attr('rounded', properties.rounded || '')
    + attr('isochrone', properties.isochrone) + attr('route-from', properties.route_from) + attr('height', '100%') + ' style="display:block;height:100%"></yatmo-map>';
  if (html === instance.data.last) return;
  instance.data.last = html;
  instance.data.ready.then(function () {
    if (html !== instance.data.last) return;
    instance.data.host.innerHTML = html;
    var el = instance.data.host.firstChild;
    // The element shows a dashed notice when the address is not found: expose it as a state.
    setTimeout(function () {
      var notice = el && el.querySelector('.yatmo-notice');
      instance.publishState('address_found', !notice);
      instance.triggerEvent('loaded');
    }, 2500);
  });
}

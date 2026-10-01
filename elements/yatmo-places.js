// Bubble element "Yatmo Places": paste `initialize` and `update` into the element's code editor.
// Renders <yatmo-pois>: the nearest places by category with travel times, as headings and lists styled by
// the page (add CSS in the app's header if needed, for example yatmo-pois ul { list-style: none; padding: 0 }).

function(instance, context) {
  // initialize
  instance.data.last = '';
  var host = document.createElement('div');
  host.style.cssText = 'width:100%;height:100%;overflow:auto';
  instance.canvas.append(host);
  instance.data.host = host;
  instance.data.ready = (window.customElements && customElements.whenDefined) ? customElements.whenDefined('yatmo-pois').then(function () { return true; }).catch(function () { return false; }) : Promise.resolve(true);
}

function(instance, properties, context) {
  // update
  // The key: the element's field, else the plugin key set once in the app's Plugins tab (Additional keys).
  var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
  var attr = function (name, value) { return (value === undefined || value === null || value === '') ? '' : ' ' + name + '="' + esc(value) + '"'; };
  var location = (properties.latitude !== undefined && properties.longitude !== undefined && properties.latitude !== null && properties.longitude !== null)
    ? attr('latitude', properties.latitude) + attr('longitude', properties.longitude)
    : attr('address', properties.address);
  var html = '<yatmo-pois' + attr('key', properties.license_key || (context.keys && context.keys.license_key) || '') + attr('country', properties.country || 'BE') + attr('language', properties.language || 'EN') + location
    + attr('categories', properties.categories) + attr('mode', properties.travel_mode) + attr('limit', properties.limit) + attr('heading', properties.heading) + '></yatmo-pois>';
  if (html === instance.data.last) return;
  instance.data.last = html;
  instance.data.ready.then(function () {
    if (html !== instance.data.last) return;
    instance.data.host.innerHTML = html;
    var el = instance.data.host.firstChild;
    el.addEventListener('yatmo-pois', function () {
      instance.publishState('address_found', true);
      instance.triggerEvent('loaded');
    }, { once: true });
    setTimeout(function () { if (el.querySelector('.yatmo-notice')) { instance.publishState('address_found', false); instance.triggerEvent('loaded'); } }, 4000);
  });
}

const assert = require('assert');

const SiteSettings = require('./src/models/SiteSettings');
const Service = require('./src/models/Service');
const PricingPlan = require('./src/models/PricingPlan');

assert.ok(SiteSettings && typeof SiteSettings === 'function');
assert.ok(Service && typeof Service === 'function');
assert.ok(PricingPlan && typeof PricingPlan === 'function');

console.log('CMS models loaded successfully');

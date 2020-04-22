import _ from './underscore.js'
import * as utils from './utils.js'
import template from './template.js'

_.mixin({ template })

_.mixin(utils);

_.mixin(_);

export default _;
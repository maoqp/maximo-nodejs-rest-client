
'use strict';

module.exports = MaximoFactory;

var ResourceObject = require('./resources/resourceobject');

var InvalidArgumentError = require('./error/error');
var events = require('events');
var url = require('url');
var AuthConnector = require('./resources/connectors/authconnector');

/**
 @typedef MaximoProperties
 @type {object}
 @property {string} protocol
 @property {string} hostname
 @property {number} port
 @property {string} user
 @property {string} password
 @property {string} tenantcode
 @property {string} auth_scheme
 @property {string} authtype
 @property {boolean} islean
 */


/**
 *
 * Creates an object for exposing Maximo OSLC API
 *
 * @param {MaximoProperties} options
 * @param cookie
 * @param callback
 * @returns {MaximoFactory}
 * @constructor
 */
function MaximoFactory(options,cookie,callback)
{
	this.protocol = options.protocol;
	this.hostname = options.hostname;
	this.port = options.port;
 	this.user = options.user;
 	this.password = options.password;
 	this.islean = 0;
 	this.tenantcode = options.tenantcode;
 	this.auth_scheme = options.auth_scheme;
 	this.authType = options.authtype;
 	this.cookie = cookie;
 	this.isCookieSet = this.cookie ? true : false;

 	if(this.authType && this.authType == "form")
 	{
 		this.authPath = this.auth_scheme+"/j_security_check";
 	}


 	if(options.islean != null)
 	{
 		this.islean = options.islean;
 	}

 	console.log("### islean "+this.islean);

 	this.resturl = url.parse(this.protocol+"://"+this.user+":"+this.password+"@"+this.hostname+":"+this.port);

 	this.resturl.auth_scheme = this.auth_scheme;

 	if(callback != null)
 	{
		if(this.hostname === "" || this.user === "" || this.password === "")
		{
			callback(new Error("Invalid null arguments.",""));
		}
	}
	return this;
}

/**
 *
 * @returns {*}
 */
MaximoFactory.prototype.authenticate = function()
{
	this.authC = new AuthConnector(this.resturl);
	this.authC.authType = this.authType;
    return this.authC.authenticate(this.authC);
};

/**
 *
 * @param mbo
 * @returns {ResourceObject}
 */
MaximoFactory.prototype.resourceobject = function(mbo)
{
    //return new ResourceSet(this.resturl,this.user,this.password,mbo);
    return new ResourceObject(this,mbo);
};

/**
 *
 * @returns {string|*}
 */
MaximoFactory.prototype.publicuri = function()
{
    return this.hostname;
};

/**
 *
 * @returns {MaximoFactory.user|*}
 */
MaximoFactory.prototype.user = function()
{
    return this.user;
};

/**
 *
 */
MaximoFactory.prototype.isCookieSet;

'use strict';

var _ = require('lodash');
var Q = require('q');
var LocalList = require('./incomingPhoneNumber/local').LocalList;
var MobileList = require('./incomingPhoneNumber/mobile').MobileList;
var Page = require('../../../../base/Page');
var TollFreeList = require('./incomingPhoneNumber/tollFree').TollFreeList;
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var IncomingPhoneNumberPage;
var IncomingPhoneNumberList;
var IncomingPhoneNumberInstance;
var IncomingPhoneNumberContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberPage
 * @augments Page
 * @description Initialize the IncomingPhoneNumberPage
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} ownerAccountSid -
 *          A 34 character string that uniquely identifies this resource.
 *
 * @returns IncomingPhoneNumberPage
 */
/* jshint ignore:end */
function IncomingPhoneNumberPage(version, response, ownerAccountSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    ownerAccountSid: ownerAccountSid
  };
}

_.extend(IncomingPhoneNumberPage.prototype, Page.prototype);
IncomingPhoneNumberPage.prototype.constructor = IncomingPhoneNumberPage;

/* jshint ignore:start */
/**
 * Build an instance of IncomingPhoneNumberInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberPage.prototype.getInstance = function getInstance(payload) {
  return new IncomingPhoneNumberInstance(
    this._version,
    payload,
    this._solution.ownerAccountSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
 * @description Initialize the IncomingPhoneNumberList
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} ownerAccountSid -
 *          A 34 character string that uniquely identifies this resource.
 */
/* jshint ignore:end */
function IncomingPhoneNumberList(version, ownerAccountSid) {
  /* jshint ignore:start */
  /**
   * @function incomingPhoneNumbers
   * @memberof Twilio.Api.V2010.AccountContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext}
   */
  /* jshint ignore:end */
  function IncomingPhoneNumberListInstance(sid) {
    return IncomingPhoneNumberListInstance.get(sid);
  }

  IncomingPhoneNumberListInstance._version = version;
  // Path Solution
  IncomingPhoneNumberListInstance._solution = {
    ownerAccountSid: ownerAccountSid
  };
  IncomingPhoneNumberListInstance._uri = _.template(
    '/Accounts/<%= ownerAccountSid %>/IncomingPhoneNumbers.json' // jshint ignore:line
  )(IncomingPhoneNumberListInstance._solution);

  // Components
  IncomingPhoneNumberListInstance._local = undefined;
  IncomingPhoneNumberListInstance._mobile = undefined;
  IncomingPhoneNumberListInstance._tollFree = undefined;

  /* jshint ignore:start */
  /**
   * Streams IncomingPhoneNumberInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.beta] - Include new phone numbers
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.phoneNumber] - Filter by incoming phone number
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  IncomingPhoneNumberListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists IncomingPhoneNumberInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.beta] - Include new phone numbers
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.phoneNumber] - Filter by incoming phone number
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  IncomingPhoneNumberListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of IncomingPhoneNumberInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.beta] - Include new phone numbers
   * @param {string} [opts.friendlyName] - Filter by friendly name
   * @param {string} [opts.phoneNumber] - Filter by incoming phone number
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  IncomingPhoneNumberListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'Beta': opts.beta,
      'FriendlyName': opts.friendlyName,
      'PhoneNumber': opts.phoneNumber,
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new IncomingPhoneNumberPage(
        this._version,
        payload,
        this._solution.ownerAccountSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * create a IncomingPhoneNumberInstance
   *
   * @function create
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.apiVersion] - The Twilio Rest API version to use
   * @param {string} [opts.friendlyName] -
   *          A human readable description of this resource
   * @param {string} [opts.smsApplicationSid] -
   *          Unique string that identifies the application
   * @param {string} [opts.smsFallbackMethod] -
   *          HTTP method used with sms fallback url
   * @param {string} [opts.smsFallbackUrl] -
   *          URL Twilio will request if an error occurs in executing TwiML
   * @param {string} [opts.smsMethod] - HTTP method to use with sms url
   * @param {string} [opts.smsUrl] - URL Twilio will request when receiving an SMS
   * @param {string} [opts.statusCallback] -
   *          URL Twilio will use to pass status parameters
   * @param {string} [opts.statusCallbackMethod] -
   *          HTTP method twilio will use with status callback
   * @param {string} [opts.voiceApplicationSid] -
   *          The unique sid of the application to handle this number
   * @param {string} [opts.voiceCallerIdLookup] - Look up the caller's caller-ID
   * @param {string} [opts.voiceFallbackMethod] - HTTP method used with fallback_url
   * @param {string} [opts.voiceFallbackUrl] -
   *          URL Twilio will request when an error occurs in TwiML
   * @param {string} [opts.voiceMethod] - HTTP method used with the voice url
   * @param {string} [opts.voiceUrl] - URL Twilio will request when receiving a call
   * @param {string} [opts.phoneNumber] - The phone number
   * @param {string} [opts.areaCode] - The desired area code for the new number
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
   */
  /* jshint ignore:end */
  IncomingPhoneNumberListInstance.create = function create(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PhoneNumber': opts.phoneNumber,
      'AreaCode': opts.areaCode,
      'ApiVersion': opts.apiVersion,
      'FriendlyName': opts.friendlyName,
      'SmsApplicationSid': opts.smsApplicationSid,
      'SmsFallbackMethod': opts.smsFallbackMethod,
      'SmsFallbackUrl': opts.smsFallbackUrl,
      'SmsMethod': opts.smsMethod,
      'SmsUrl': opts.smsUrl,
      'StatusCallback': opts.statusCallback,
      'StatusCallbackMethod': opts.statusCallbackMethod,
      'VoiceApplicationSid': opts.voiceApplicationSid,
      'VoiceCallerIdLookup': opts.voiceCallerIdLookup,
      'VoiceFallbackMethod': opts.voiceFallbackMethod,
      'VoiceFallbackUrl': opts.voiceFallbackUrl,
      'VoiceMethod': opts.voiceMethod,
      'VoiceUrl': opts.voiceUrl
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new IncomingPhoneNumberInstance(
        this._version,
        payload,
        this._solution.ownerAccountSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  Object.defineProperty(IncomingPhoneNumberListInstance,
    'local', {
    get: function local() {
      if (!this._local) {
        this._local = new LocalList(
          this._version,
          this._solution.ownerAccountSid
        );
      }

      return this._local;
    },
  });

  Object.defineProperty(IncomingPhoneNumberListInstance,
    'mobile', {
    get: function mobile() {
      if (!this._mobile) {
        this._mobile = new MobileList(
          this._version,
          this._solution.ownerAccountSid
        );
      }

      return this._mobile;
    },
  });

  Object.defineProperty(IncomingPhoneNumberListInstance,
    'tollFree', {
    get: function tollFree() {
      if (!this._tollFree) {
        this._tollFree = new TollFreeList(
          this._version,
          this._solution.ownerAccountSid
        );
      }

      return this._tollFree;
    },
  });

  /* jshint ignore:start */
  /**
   * Constructs a incoming_phone_number
   *
   * @function get
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberList
   * @instance
   *
   * @param {string} sid - Fetch by unique incoming-phone-number Sid
   *
   * @returns {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext}
   */
  /* jshint ignore:end */
  IncomingPhoneNumberListInstance.get = function get(sid) {
    return new IncomingPhoneNumberContext(
      this._version,
      this._solution.ownerAccountSid,
      sid
    );
  };

  return IncomingPhoneNumberListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberInstance
 * @description Initialize the IncomingPhoneNumberContext
 *
 * @property {string} accountSid - The unique sid that identifies this account
 * @property {incoming_phone_number.address_requirement} addressRequirements -
 *          Indicates if the customer requires an address
 * @property {string} apiVersion - The Twilio REST API version to use
 * @property {string} beta - Indicates if the phone number is a beta number
 * @property {string} capabilities -
 *          Indicate if a phone can receive calls or messages
 * @property {Date} dateCreated - The date this resource was created
 * @property {Date} dateUpdated - The date this resource was last updated
 * @property {string} friendlyName - A human readable description of this resouce
 * @property {string} phoneNumber - The incoming phone number
 * @property {string} sid - A string that uniquely identifies this resource
 * @property {string} smsApplicationSid -
 *          Unique string that identifies the application
 * @property {string} smsFallbackMethod - HTTP method used with sms fallback url
 * @property {string} smsFallbackUrl -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @property {string} smsMethod - HTTP method to use with sms url
 * @property {string} smsUrl - URL Twilio will request when receiving an SMS
 * @property {string} statusCallback -
 *          URL Twilio will use to pass status parameters
 * @property {string} statusCallbackMethod -
 *          HTTP method twilio will use with status callback
 * @property {string} uri - The URI for this resource
 * @property {string} voiceApplicationSid -
 *          The unique sid of the application to handle this number
 * @property {string} voiceCallerIdLookup - Look up the caller's caller-ID
 * @property {string} voiceFallbackMethod - HTTP method used with fallback_url
 * @property {string} voiceFallbackUrl -
 *          URL Twilio will request when an error occurs in TwiML
 * @property {string} voiceMethod - HTTP method used with the voice url
 * @property {string} voiceUrl - URL Twilio will request when receiving a call
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} ownerAccountSid - The owner_account_sid
 * @param {sid} sid - Fetch by unique incoming-phone-number Sid
 */
/* jshint ignore:end */
function IncomingPhoneNumberInstance(version, payload, ownerAccountSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.addressRequirements = payload.address_requirements; // jshint ignore:line
  this.apiVersion = payload.api_version; // jshint ignore:line
  this.beta = payload.beta; // jshint ignore:line
  this.capabilities = payload.capabilities; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.phoneNumber = payload.phone_number; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.smsApplicationSid = payload.sms_application_sid; // jshint ignore:line
  this.smsFallbackMethod = payload.sms_fallback_method; // jshint ignore:line
  this.smsFallbackUrl = payload.sms_fallback_url; // jshint ignore:line
  this.smsMethod = payload.sms_method; // jshint ignore:line
  this.smsUrl = payload.sms_url; // jshint ignore:line
  this.statusCallback = payload.status_callback; // jshint ignore:line
  this.statusCallbackMethod = payload.status_callback_method; // jshint ignore:line
  this.uri = payload.uri; // jshint ignore:line
  this.voiceApplicationSid = payload.voice_application_sid; // jshint ignore:line
  this.voiceCallerIdLookup = payload.voice_caller_id_lookup; // jshint ignore:line
  this.voiceFallbackMethod = payload.voice_fallback_method; // jshint ignore:line
  this.voiceFallbackUrl = payload.voice_fallback_url; // jshint ignore:line
  this.voiceMethod = payload.voice_method; // jshint ignore:line
  this.voiceUrl = payload.voice_url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    ownerAccountSid: ownerAccountSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(IncomingPhoneNumberInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new IncomingPhoneNumberContext(
        this._version,
        this._solution.ownerAccountSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * update a IncomingPhoneNumberInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberInstance
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.accountSid] - The new owner of the phone number
 * @param {string} [opts.apiVersion] - The Twilio REST API version to use
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {string} [opts.smsApplicationSid] -
 *          Unique string that identifies the application
 * @param {string} [opts.smsFallbackMethod] -
 *          HTTP method used with sms fallback url
 * @param {string} [opts.smsFallbackUrl] -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @param {string} [opts.smsMethod] - HTTP method to use with sms url
 * @param {string} [opts.smsUrl] - URL Twilio will request when receiving an SMS
 * @param {string} [opts.statusCallback] -
 *          URL Twilio will use to pass status parameters
 * @param {string} [opts.statusCallbackMethod] -
 *          HTTP method twilio will use with status callback
 * @param {string} [opts.voiceApplicationSid] -
 *          The unique sid of the application to handle this number
 * @param {string} [opts.voiceCallerIdLookup] - Look up the caller's caller-ID
 * @param {string} [opts.voiceFallbackMethod] - HTTP method used with fallback_url
 * @param {string} [opts.voiceFallbackUrl] -
 *          URL Twilio will request when an error occurs in TwiML
 * @param {string} [opts.voiceMethod] - HTTP method used with the voice url
 * @param {string} [opts.voiceUrl] - URL Twilio will request when receiving a call
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};

/* jshint ignore:start */
/**
 * fetch a IncomingPhoneNumberInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a IncomingPhoneNumberInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext
 * @description Initialize the IncomingPhoneNumberContext
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {sid} ownerAccountSid - The owner_account_sid
 * @param {sid} sid - Fetch by unique incoming-phone-number Sid
 */
/* jshint ignore:end */
function IncomingPhoneNumberContext(version, ownerAccountSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    ownerAccountSid: ownerAccountSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Accounts/<%= ownerAccountSid %>/IncomingPhoneNumbers/<%= sid %>.json' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * update a IncomingPhoneNumberInstance
 *
 * @function update
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext
 * @instance
 *
 * @param {object|function} opts - ...
 * @param {string} [opts.accountSid] - The new owner of the phone number
 * @param {string} [opts.apiVersion] - The Twilio REST API version to use
 * @param {string} [opts.friendlyName] -
 *          A human readable description of this resource
 * @param {string} [opts.smsApplicationSid] -
 *          Unique string that identifies the application
 * @param {string} [opts.smsFallbackMethod] -
 *          HTTP method used with sms fallback url
 * @param {string} [opts.smsFallbackUrl] -
 *          URL Twilio will request if an error occurs in executing TwiML
 * @param {string} [opts.smsMethod] - HTTP method to use with sms url
 * @param {string} [opts.smsUrl] - URL Twilio will request when receiving an SMS
 * @param {string} [opts.statusCallback] -
 *          URL Twilio will use to pass status parameters
 * @param {string} [opts.statusCallbackMethod] -
 *          HTTP method twilio will use with status callback
 * @param {string} [opts.voiceApplicationSid] -
 *          The unique sid of the application to handle this number
 * @param {string} [opts.voiceCallerIdLookup] - Look up the caller's caller-ID
 * @param {string} [opts.voiceFallbackMethod] - HTTP method used with fallback_url
 * @param {string} [opts.voiceFallbackUrl] -
 *          URL Twilio will request when an error occurs in TwiML
 * @param {string} [opts.voiceMethod] - HTTP method used with the voice url
 * @param {string} [opts.voiceUrl] - URL Twilio will request when receiving a call
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberContext.prototype.update = function update(opts, callback) {
  if (_.isFunction(opts)) {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var deferred = Q.defer();
  var data = values.of({
    'AccountSid': opts.accountSid,
    'ApiVersion': opts.apiVersion,
    'FriendlyName': opts.friendlyName,
    'SmsApplicationSid': opts.smsApplicationSid,
    'SmsFallbackMethod': opts.smsFallbackMethod,
    'SmsFallbackUrl': opts.smsFallbackUrl,
    'SmsMethod': opts.smsMethod,
    'SmsUrl': opts.smsUrl,
    'StatusCallback': opts.statusCallback,
    'StatusCallbackMethod': opts.statusCallbackMethod,
    'VoiceApplicationSid': opts.voiceApplicationSid,
    'VoiceCallerIdLookup': opts.voiceCallerIdLookup,
    'VoiceFallbackMethod': opts.voiceFallbackMethod,
    'VoiceFallbackUrl': opts.voiceFallbackUrl,
    'VoiceMethod': opts.voiceMethod,
    'VoiceUrl': opts.voiceUrl
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new IncomingPhoneNumberInstance(
      this._version,
      payload,
      this._solution.ownerAccountSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * fetch a IncomingPhoneNumberInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new IncomingPhoneNumberInstance(
      this._version,
      payload,
      this._solution.ownerAccountSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * remove a IncomingPhoneNumberInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed IncomingPhoneNumberInstance
 */
/* jshint ignore:end */
IncomingPhoneNumberContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  IncomingPhoneNumberPage: IncomingPhoneNumberPage,
  IncomingPhoneNumberList: IncomingPhoneNumberList,
  IncomingPhoneNumberInstance: IncomingPhoneNumberInstance,
  IncomingPhoneNumberContext: IncomingPhoneNumberContext
};

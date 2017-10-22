
/// <reference path="../types/jquery.d.ts" />
/// <reference path="../types/knockout.d.ts" />

var localUrl: string = 'http://localhost:8080';

function sendAjaxPost(targetUrl: string , postData: object , callback: (isSuccess: boolean , result: object)=> any)
{
    $.ajax({
        type     : 'POST',
        url      : targetUrl,
        data     : JSON.stringify(postData),
        dataType : 'json',
        async    : true,

        error    : function(jqXHR , status)
        {
            // Failure.
            callback(false , {'error' : 'AJAX Error: ' + status});
        },
        success  : function (data , status , jqXHR)
        {
            // Success, although the returned object could have 'error'.
 			callback(true , jqXHR.responseJSON);
		}
    });
}

/******************************************************************************
 *
 * View model.
 *
 ******************************************************************************/

class CalcData
{
	fcn: string		= 'calculate';
	arg: number[]	= [1,2,3];
}

class ExampleViewModel
{
	value1: KnockoutObservable<string> = ko.observable('1');
	value2: KnockoutObservable<string> = ko.observable('2');
	value3: KnockoutObservable<string> = ko.observable('3');

	result: KnockoutObservable<string> = ko.observable('6');

	constructor()
	{
		ko.applyBindings(this , $('body')[0]);
	}

	onClick()
	{
		var self: ExampleViewModel = this;
		var calcData: CalcData;

		// Create a new CalcData object.
		calcData = new CalcData();

		// Convert the edit boxes to numbers.
		calcData.arg[0] = Number(self.value1());
		calcData.arg[1] = Number(self.value2());
		calcData.arg[2] = Number(self.value3());

		// Make the AJAX request.
		sendAjaxPost(localUrl , calcData , function(isSuccess: boolean , obj: object)
		{
			/*
			 * The response will be either:
			 *
			 * {'result': number}		// Success.
			 * 		or
			 * {'error' : 'reason'}		// Error; networ/client/server
			 *
			 */
			// Ignore errors for now.
			if (!isSuccess || (obj['error'] !== undefined))
				return;
			// Display the result.
			self.result(obj['result']);
		})
	}
}
//
var exampleViewModel: ExampleViewModel;

/******************************************************************************
 *
 * Main
 *
 ******************************************************************************/

$(document).ready(function()
{
	exampleViewModel = new ExampleViewModel();
});
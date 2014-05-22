function WriteCookie(name, value)
{
	var now = new Date();
	now.setMonth( now.getMonth() + 1 );
	cookievalue = escape(value) + ";";
	document.cookie= name + "=" + cookievalue;
	document.cookie = "expires=" + now.toUTCString() + ";";
}

function trimString (str)
{
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function ReadCookie(cookieName)
{
	var cookiearray = document.cookie.split(';');
	for(var i = 0; i < cookiearray.length; i++)
	{
		cookiearray[i] = trimString(cookiearray[i]);
		name = cookiearray[i].split('=')[0];
		value = cookiearray[i].split('=')[1];
		if(name == cookieName)
		{
			return value;
		}
	}
}

function DeleteCookie(name)
{
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

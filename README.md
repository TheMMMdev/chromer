# chromer
Chrome extension that captures network traffic based on a predefined whitelist and sends JSON blocks to a specified IP

To install and run, there needs to be a few changes. Due to how Chrome extensions work, it's a challenge to implement some kind of config file, so within 'background.js', you need to edit two (2) things. 

First thing is to add a defined whitelist of wildcards of which you want to capture the traffic. The line in which you can add this is line ``8``. 
The format for this whitelist is: ``"https://*.[domain]/*", "https://*.[domain2]/*"`` etc.

Second is you need to add an endpoint to the extension which will accept a JSON array. In case you want a default (simple) version, please have a look at my simple-middleman repository.

The line in which you need to place the IP, is ``line 86``.

Do note that this tool will sort the urls uniquely.

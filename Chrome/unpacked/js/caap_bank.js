/////////////////////////////////////////////////////////////////////
//                          BANKING
// Keep it safe!
/////////////////////////////////////////////////////////////////////

caap.immediateBanking = function() {
	if(!config.getItem("BankImmed", false)) {
		return false;
	}

	return caap.bank();
};
/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
caap.bank = function() {
	try {
		if(config.getItem("NoBankAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false)) {
			return false;
		}

		var maxInCash = -1, minInCash = 0, depositButton = null, numberInput = null, deposit = 0;
		maxInCash = config.getItem('MaxInCash', -1);
		minInCash = config.getItem('MinInCash', 0);
		if(!maxInCash || maxInCash < 0 || caap.stats['gold']['cash'] <= minInCash || caap.stats['gold']['cash'] < maxInCash || caap.stats['gold']['cash'] < 10) {
			return false;
		}

		if(general.Select('BankingGeneral')) {
			return true;
		}
		depositButton = $j("input[src*='btn_stash.gif']");
		if(!depositButton || !depositButton.length) {
			// Cannot find the link
			return caap.navigateTo('keep');
		}
		numberInput = $j("input[name='stash_gold']");
		if(!numberInput || !numberInput.length) {
			con.warn('Cannot find box to put in number for bank deposit.');
			return false;
		}
		deposit = caap.stats['gold']['cash'] - minInCash;
		numberInput.attr("value", deposit);
		con.log(1, 'Depositing into bank:', deposit);
		caap.click(depositButton);
		return true;
	} catch (err) {
		con.error("ERROR in Bank: " + err);
		return false;
	}
};
caap.retrieveFromBank = function(num) {
	try {
		if(num <= 0) {
			return false;
		}

		var retrieveButton = null, numberInput = null, minInStore = 0;
		retrieveButton = $j("input[src*='keep_btn_retireve.gif']");
		if(!retrieveButton || !retrieveButton.length) {
			// Cannot find the link
			return caap.navigateTo('keep');
		}
		minInStore = config.getItem('minInStore', 0);
		if(!(minInStore || minInStore <= caap.stats['gold']['bank'] - num)) {
			return false;
		}
		numberInput = $j("input[name='get_gold']");
		if(!numberInput || !numberInput.length) {
			con.warn('Cannot find box to put in number for bank retrieve.');
			return false;
		}

		numberInput.attr("value", num);
		con.log(1, 'Retrieving from bank:', num);
		state.setItem('storeRetrieve', '');
		caap.click(retrieveButton);
		return true;
	} catch (err) {
		con.error("ERROR in retrieveFromBank: " + err);
		return false;
	}
};

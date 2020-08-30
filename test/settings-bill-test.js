const assert = require('assert');

const SettingsBill = require('../settings-bill');

describe('settings-bill', function(){

    const settingsBill = SettingsBill();

    it('should be able to record calls', function(){
        settingsBill.recordAction('call');
        assert.equal(1, settingsBill.actionsFor('call').length);
    });

    it('should be able to set the settings', function(){
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost: 1.80,
            warningLevel: 30,
            criticalLevel: 40
        });

        assert.deepEqual({
            smsCost: 0.75,
            callCost:1.80,
            warningLevel: 30,
            criticalLevel: 40
        }, settingsBill.getSettings())


    });

    it('should calculate the right totals', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost:1.80,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(0.75, settingsBill.totals().smsTotal);
        assert.equal(1.80, settingsBill.totals().callTotal);
        assert.equal(2.55, settingsBill.totals().grandTotal);

    });

    it('should calculate the right totals for multiple actions', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 0.75,
            callCost: 1.80,
            warningLevel: 30,
            criticalLevel: 40
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');
        settingsBill.recordAction('sms');

        assert.equal(1.50, settingsBill.totals().smsTotal);
        assert.equal(3.60, settingsBill.totals().callTotal);
        assert.equal(5.10, settingsBill.totals().grandTotal);

    });

    it('should know when warning level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 1.75,
            callCost: 3.30,
            warningLevel: 18,
            criticalLevel: 13
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(false, settingsBill.hasReachedWarningLevel());
    });

    it('should know when critical level reached', function(){
        const settingsBill = SettingsBill();
        settingsBill.setSettings({
            smsCost: 1.75,
            callCost: 3.30,
            warningLevel: 18,
            criticalLevel: 13
        });

        settingsBill.recordAction('call');
        settingsBill.recordAction('call');
        settingsBill.recordAction('sms');

        assert.equal(false, settingsBill.hasReachedCriticalLevel());

    });
});

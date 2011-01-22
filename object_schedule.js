
    ////////////////////////////////////////////////////////////////////
    //                          schedule OBJECT
    // this is the main object for dealing with scheduling and timers
    /////////////////////////////////////////////////////////////////////

    schedule = {
        timers: {},

        load: function () {
            try {
                schedule.timers = gm.getItem('schedule.timers', 'default');
                if (schedule.timers === 'default' || !$j.isPlainObject(schedule.timers)) {
                    schedule.timers = gm.setItem('schedule.timers', {});
                }

                $u.log(5, "schedule.load", schedule.timers);
                return true;
            } catch (err) {
                $u.error("ERROR in schedule.load: " + err);
                return false;
            }
        },

        save: function (force) {
            try {
                gm.setItem('schedule.timers', schedule.timers);
                $u.log(5, "schedule.save", schedule.timers);
                return true;
            } catch (err) {
                $u.error("ERROR in schedule.save: " + err);
                return false;
            }
        },

        setItem: function (name, seconds, randomSecs) {
            try {
                var now = 0;
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name! (" + name + ")";
                }

                if (!$u.isNumber(seconds) || seconds < 0) {
                    throw "Invalid number of seconds supplied for (" + name + ") (" + seconds + ")";
                }

                if (!$u.isNumber(randomSecs) || randomSecs < 0) {
                    randomSecs = 0;
                }

                now = new Date().getTime();
                schedule.timers[name] = {
                    'last': now,
                    'next': now + (seconds * 1000) + (Math.floor(Math.random() * randomSecs) * 1000)
                };

                schedule.save();
                return schedule.timers[name];
            } catch (err) {
                $u.error("ERROR in schedule.setItem: " + err);
                return undefined;
            }
        },

        getItem: function (name) {
            try {
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name! (" + name + ")";
                }

                if (!$j.isPlainObject(schedule.timers[name])) {
                    $u.warn("Invalid or non-existant timer!", name);
                    return 0;
                }

                return schedule.timers[name];
            } catch (err) {
                $u.error("ERROR in schedule.getItem: " + err);
                return undefined;
            }
        },

        deleteItem: function (name) {
            try {
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name! (" + name + ")";
                }

                if (!$j.isPlainObject(schedule.timers[name])) {
                    $u.warn("schedule.deleteItem - Invalid or non-existant timer: ", name);
                }

                delete schedule.timers[name];
                return true;
            } catch (err) {
                $u.error("ERROR in schedule.deleteItem: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        check: function (name) {
            try {
                var scheduled = false;
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name! (" + name + ")";
                }

                if (!$j.isPlainObject(schedule.timers[name])) {
                    if ($u.get_log_level > 2) {
                        $u.warn("Invalid or non-existant timer!", name);
                    }

                    scheduled = true;
                } else if (schedule.timers[name]['next'] < new Date().getTime()) {
                    scheduled = true;
                }

                return scheduled;
            } catch (err) {
                $u.error("ERROR in schedule.check: " + err);
                return false;
            }
        },

        since: function (name_or_number, seconds) {
            try {
                var value = 0;
                if (isNaN(name_or_number)) {
                    if (!$u.isString(name_or_number) || name_or_number === '') {
                        throw "Invalid identifying name! (" + name_or_number + ")";
                    }

                    if (!$j.isPlainObject(schedule.timers[name_or_number])) {
                        if ($u.get_log_level > 2) {
                            $u.warn("Invalid or non-existant timer!", name_or_number);
                        }
                    } else {
                        value = schedule.timers[name_or_number]['last'];
                    }
                } else {
                    value = name_or_number;
                }

                return (value < (new Date().getTime() - 1000 * seconds));
            } catch (err) {
                $u.error("ERROR in schedule.since: " + err, arguments.callee.caller);
                return false;
            }
        },
        /*jslint sub: false */

        oneMinuteUpdate: function (funcName) {
            try {
                if (!state.getItem('reset' + funcName) && !schedule.check(funcName + 'Timer')) {
                    return false;
                }

                schedule.setItem(funcName + 'Timer', 60);
                state.setItem('reset' + funcName, false);
                return true;
            } catch (err) {
                $u.error("ERROR in schedule.oneMinuteUpdate: " + err);
                return undefined;
            }
        },

        FormatTime: function (time) {
            try {
                var d_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    t_day   = time.getDay(),
                    t_hour  = time.getHours(),
                    t_min   = time.getMinutes(),
                    a_p     = "PM";

                if (config.getItem("use24hr", true)) {
                    t_hour = t_hour + "";
                    if (t_hour && t_hour.length === 1) {
                        t_hour = "0" + t_hour;
                    }

                    t_min = t_min + "";
                    if (t_min && t_min.length === 1) {
                        t_min = "0" + t_min;
                    }

                    return d_names[t_day] + " " + t_hour + ":" + t_min;
                } else {
                    if (t_hour < 12) {
                        a_p = "AM";
                    }

                    if (t_hour === 0) {
                        t_hour = 12;
                    }

                    if (t_hour > 12) {
                        t_hour = t_hour - 12;
                    }

                    t_min = t_min + "";
                    if (t_min && t_min.length === 1) {
                        t_min = "0" + t_min;
                    }

                    return d_names[t_day] + " " + t_hour + ":" + t_min + " " + a_p;
                }
            } catch (err) {
                $u.error("ERROR in FormatTime: " + err);
                return "Time Err";
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        display: function (name) {
            try {
                var formatted = '';
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name!";
                }

                if (!$j.isPlainObject(schedule.timers[name])) {
                    if ($u.get_log_level > 2) {
                        $u.warn("Invalid or non-existant timer!", name);
                    }

                    formatted = schedule.FormatTime(new Date());
                } else {
                    formatted = schedule.FormatTime(new Date(schedule.timers[name]['next']));
                }

                return formatted;
            } catch (err) {
                $u.error("ERROR in schedule.display: " + err);
                return false;
            }
        }
        /*jslint sub: false */
    };

const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    sixMonthsAgo: function () {
      const sixMonthsAgo = new Date()
      const today = new Date()
      console.log(`Today is ${today}`)
      return sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    },
    //! Something about this isn't working -- without if statement getting error
    //! TypeError: Cannot read properties of undefined (reading 'getDate')
    checkedToday: function (mailChecks, createdAt) {
      const today = new Date()
      const lastChecked = mailChecks[mailChecks.length - 1]
      if (lastChecked) {
        return lastChecked.getDate() == today.getDate()
      }
    },
    checkSafety: (safetyConcern) => {
      if (safetyConcern == true) {
        return true
      } else {
        return false
      }
    },
    checkStatus: (status) => {
      return status == 'Open'
    },
    //! This is not working
    isInactive: function(mailChecks) {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      let lastChecked = mailChecks[mailChecks.length - 1]
      lastChecked = new Date(lastChecked)
      console.log(lastChecked)
      if (lastChecked.getMonth() < sixMonthsAgo) {
        return true
      }
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let new_str = str + ' '
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    // editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    //     if (storyUser._id.toString() == loggedUser._id.toString()) {
    //       if (floating) {
    //         return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
    //       } else {
    //         return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
    //       }
    //     } else {
    //       return ''
    //     }
    // },
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
    },
}
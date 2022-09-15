const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    sixMonthsAgo: function () {
      const sixMonthsAgo = new Date()
      const today = new Date()
      return sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    },
    //! Something about this isn't working -- without if statement getting error
    //! TypeError: Cannot read properties of undefined (reading 'getDate')

    // should be able to check if createdAt date matches today too but not working so I deleted the code and left the variable
    checkedToday: function (mailChecks, createdAt) {
      const today = new Date()
      let lastChecked = mailChecks[mailChecks.length - 1]
      lastChecked = new Date(lastChecked)
      
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
    isInactive: function(mailChecks) {
      let lastChecked = mailChecks[mailChecks.length - 1]
      lastChecked = new Date(lastChecked)
      const today = new Date()

      if (lastChecked) {
        const sixMonthsInMs = 180 * 24 * 60 * 60 * 1000
        const timeDiffInMs = today.getTime() - lastChecked.getTime()

        if (timeDiffInMs >= sixMonthsInMs) {
          console.log('Date is older than 180 days')
          return true
        } else {
          console.log('Date is not older than 180 days')
          return false
        }
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
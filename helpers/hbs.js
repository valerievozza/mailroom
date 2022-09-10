const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    mailChecks: (mailChecks) => {
      return mailChecks
    },
    lastChecked: (lastChecked) => {
      lastChecked = mailChecks[mailChecks.length - 1]
      return lastChecked
    },
    //! Something about this isn't working -- without if statement getting error
    //! TypeError: Cannot read properties of undefined (reading 'getDate')
    checkedToday: (lastChecked) => {
      const today = new Date()
      if (lastChecked) {
        return lastChecked.getDate() == today.getDate() &&
        lastChecked.getMonth() == today.getMonth() &&
        lastChecked.getFullYear() == today.getFullYear() 
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
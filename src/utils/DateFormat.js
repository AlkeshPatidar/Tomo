import moment from "moment"

  export const  formatInstagramDate = dateString => {
    const date = moment(dateString)
    const now = moment()

    const diffInSeconds = now.diff(date, 'seconds')
    const diffInMinutes = now.diff(date, 'minutes')
    const diffInHours = now.diff(date, 'hours')
    const diffInDays = now.diff(date, 'days')
    const diffInWeeks = now.diff(date, 'weeks')

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    }

    if (diffInHours < 24) {
      return `${diffInHours}h`
    }

    if (diffInDays < 7) {
      return `${diffInDays}d`
    }

    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`
    }

    if (date.year() === now.year()) {
      return date.format('MMM D')
    } else {
      return date.format('MMM D, YYYY')
    }
  }
import moment from 'moment'

export const DateFormats = {
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  DATE_TIME_SECONDS: 'DD/MM/YYYY HH:mm:ss',
  DATE_TIME_SECONDS_MILLISECONDS: 'DD/MM/YYYY HH:mm:ss.SSS',
  TIME: 'HH:mm',
  TIME_SECONDS: 'HH:mm:ss',
  TIME_SECONDS_MILLISECONDS: 'HH:mm:ss.SSS',
  DATE_TIME_ISO: 'YYYY-MM-DDTHH:mm:sssZ',
}
export class Formaters {
  static formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
  }

  static formatDate(date, format = DateFormats.DATE) {
    if (!date) return ''
    if (format === DateFormats.DATE_TIME_ISO) {
      return moment(date).toISOString()
    } else {
      return moment(date).format(format)
    }
  }
}

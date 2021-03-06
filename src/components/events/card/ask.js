import moment from 'moment'
import Markup from 'telegraf/markup'
import api from '../../../common/api'
import { cbQueryTypes, replies } from '../../../common/strings'

const remindDays = [{ days: 1, text: 'За день' }, { days: 3, text: 'За 3 дня' }, { days: 7, text: 'За неделю' }]

export async function askForDay(ctx, payload) {
    if (!ctx.callbackQuery) return

    const [eventID] = payload

    const event = await api.get(Number(eventID))

    const startDate = moment(event.time.dates[0])
    const diff = startDate.diff(moment(), 'day')
    const msgID = ctx.callbackQuery.message ? ctx.callbackQuery.message.message_id : 0

    if (diff === 0) {
        ctx.replyWithHTML(replies.lateForReminders, { reply_to_message_id: msgID })
    } else {
        const buttonsRow = []

        remindDays.forEach(({ days, text }) => {
            if (diff >= days) {
                const data = `${cbQueryTypes['reminder-new']}|${event.id}:${days}:${msgID}`
                buttonsRow.push(Markup.callbackButton(text, data))
            }
        })

        ctx.replyWithHTML(replies.whenToRemind, Markup.inlineKeyboard(buttonsRow).extra({ reply_to_message_id: msgID }))
    }
}

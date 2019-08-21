import { t } from '../i18n';

export const required = value => value ? undefined : t('Required');
export const number = value => (value === undefined ? false : Number(value.replace(',', '.'))) && !isNaN(Number(value.replace(",", "."))) ?  undefined : t('Must be a number');

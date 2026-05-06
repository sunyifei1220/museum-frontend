export const formatNumber = (num: number) => new Intl.NumberFormat('zh-CN').format(num);

export const toYesNo = (value?: string) => {
  if (!value) return '否';
  return '是';
};

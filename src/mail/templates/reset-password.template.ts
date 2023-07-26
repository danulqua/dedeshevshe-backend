export interface ResetPasswordHTMLProps {
  name: string;
  url: string;
}

export const resetPasswordHTML = ({ name, url }: ResetPasswordHTMLProps) => `
  <p>Привіт, ${name}!</p>
  <p>Ви створили запит на зміну паролю.</p>
  <p>
    Перейдіть за цим посиланням для встановлення нового паролю:
    <a href='${url}'>${url}</a>
  </p>

  <p>Якщо Ви не створювали запит на зміну паролю, проігноруйте цей лист.</p>
`;

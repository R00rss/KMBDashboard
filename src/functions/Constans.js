const colors =
  [/*green*/'#5dd422',
  /*neon*/'#22d490',
  /*red*/'#d43a22',
  /*blue*/'#2257d4',
  /*yellow*/'#d4ad22',
  /*purple*/'#9922d4',
  /*pink*/'#d4224c'];

export const estilos_calendario = {
  label: {
    color: 'var(--selects-font-colors)',
    fontFamily: "Proxima Nova Ligth",
  },
  input: {
    color: "var(--selects-font-colors)",
    fontFamily: "Proxima Nova Ligth",
    fontSize: "13px",
    padding: "14px 0px"
  },
  button: {
    marginRight: '-6px',
    borderRadius: '2px',
    backgroundColor: '#333333',
    ":hover": { backgroundColor: '#222222' }
  },
  svg: {
    color: 'var(--selects-font-colors)'
  }
}

export default colors;
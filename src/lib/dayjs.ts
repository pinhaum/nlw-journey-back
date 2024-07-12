import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localazideFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("pt-br");
dayjs.extend(localazideFormat);

export { dayjs };

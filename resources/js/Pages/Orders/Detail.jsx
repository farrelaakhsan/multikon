import { useOrderScenario } from "./Detail/useOrderScenario";
import ReadyStockRegular from "./Detail/scenarios/ReadyStockRegular";
import ReadyStockTop from "./Detail/scenarios/ReadyStockTop";
import CustomFullPayment from "./Detail/scenarios/CustomFullPayment";
import CustomTermin from "./Detail/scenarios/CustomTermin";

export default function Detail({ order }) {
    const { scenario } = useOrderScenario(order);

    switch (scenario) {
        case "ready_stock_regular":
            return <ReadyStockRegular order={order} />;
        case "ready_stock_top":
            return <ReadyStockTop order={order} />;
        case "custom_full_payment":
            return <CustomFullPayment order={order} />;
        case "custom_termin":
            return <CustomTermin order={order} />;
        default:
            return <ReadyStockRegular order={order} />;
    }
}

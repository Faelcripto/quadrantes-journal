export type SourceLink={label:string;url:string};
export type MacroNews={id:string;date:string;tag:string;title:string;summary:string;watch:string;source:SourceLink};
export type EconomicEvent={id:string;title:string;currency:'USD'|'EUR';date:string;at:string|null;source:SourceLink;why:string};
export type CurrencyScenario={currency:'USD'|'EUR';rate:string;rateLabel:string;asOf:string;facts:string;interpretation:string;sources:SourceLink[]};
export type MacroBrief={updatedAt:string;weekStart:string;weekEnd:string;heading:string;summary:string;news:MacroNews[];scenarios:CurrencyScenario[];comparison:string;events:EconomicEvent[];notes:string[]};
export type CotRow={market_and_exchange_names:string;cftc_contract_market_code:string;report_date_as_yyyy_mm_dd:string;open_interest_all:string;asset_mgr_positions_long:string;asset_mgr_positions_short:string;lev_money_positions_long:string;lev_money_positions_short:string;change_in_asset_mgr_long:string;change_in_asset_mgr_short:string;change_in_lev_money_long:string;change_in_lev_money_short:string};
export type CotSnapshot={fetchedAt:string;sourceUrl:string;rows:CotRow[]};

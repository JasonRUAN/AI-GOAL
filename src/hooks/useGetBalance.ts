import { useSuiClientQuery } from "@mysten/dapp-kit";

export function useGetBalance({
    address,
    coinType,
}: {
    address: string;
    coinType: string;
}) {
    console.log(`address: ${address}, coinType: ${coinType}`);

    const { data } = useSuiClientQuery(
        "getBalance",
        {
            owner: address,
            coinType,
        },
        {
            enabled: !!address,
        }
    );

    return data?.totalBalance;
}

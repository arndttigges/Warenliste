function findDataInText(inputText) {
    const regex1 = "\\s*(?<articleNr>\\w{2,})\\s*(?<description>[^;]*)\\s*(Bestellt:?\\s*(\\d*)\\s*([\\w\\süäö-]*))\\s*(Geliefert:?\\s*(\\d*)\\s*([\\w\\süäö-]*))?\\s*(\\d*\\s*\\w*\\s*=\\s*\\d*\\s*[\\w\\süäö-]*)?\\s*\\D(?<list_price>\\d+,\\d{2})\\s*[EUReur]*\\s*[PERper]*\\s*\\D(?<quantity>\\d*)\\s*(?<unit>[\\w\\süäö-]*)\\s*\\D(?<netto_price>\\d+,\\d{2})\\s*[EUReur]*\\s*[PERper]*";
    const match1 = inputText.match(regex1);

    if (match1) {
        return {
            articleNr: match1.groups.articleNr || '',
            description: match1.groups.description || '',
            quantity: match1.groups.quantity || '',
            unit: match1.groups.unit || '',
            list_price: match1.groups.list_price || '',
            netto_price: match1.groups.netto_price || ''
        };
    } else {
        const regex2 = "\\s*(?<articleNr>\\w{2,})\\s*(?<description>[^;]*)\\s*(Bestellt:?\\s*(\\d*)\\s*([\\w\\süäö-]*))\\s*(Geliefert:?\\s*(?<quantity>\\d*)\\s*(?<unit>[\\w\\süäö-]*))?\\s*(\\d*\\s*\\w*\\s*\\d*\\s*[\\w\\süäö-]*)?\\s*(\\d+\\s*\\w+\\s*.\\s*\\d+\\s*[\\w\\süäö-]+)?\\s*\\D(?<list_price>\\d+,\\d{2})\\s*[EUReur]*";
        const match2 = inputText.match(regex2);

        if (match2) {
            return {
                articleNr: match2.groups.articleNr || '',
                description: match2.groups.description || '',
                quantity: match2.groups.quantity || '',
                unit: match2.groups.unit || '',
                list_price: match2.groups.list_price || '',
                netto_price: match2.groups.list_price || ''
            };
        }
    }
    return null;
}

module.exports = findDataInText;
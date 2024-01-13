/* eslint-disable */
export default async () => {
    const t = {
        ["./zakaz/dto/product-zakaz.dto"]: await import("./zakaz/dto/product-zakaz.dto"),
        ["./zakaz/dto/shop-zakaz.dto"]: await import("./zakaz/dto/shop-zakaz.dto"),
        ["./product/dto/report-option.dto"]: await import("./product/dto/report-option.dto"),
        ["./user/dto/user.dto"]: await import("./user/dto/user.dto"),
        ["./shop/dto/shop-list.dto"]: await import("./shop/dto/shop-list.dto"),
        ["./shop/dto/shop.dto"]: await import("./shop/dto/shop.dto"),
        ["./file/dto/file.dto"]: await import("./file/dto/file.dto"),
        ["./product/dto/product-list.dto"]: await import("./product/dto/product-list.dto"),
        ["./product/dto/product.dto"]: await import("./product/dto/product.dto"),
        ["./product/dto/price-history.dto"]: await import("./product/dto/price-history.dto"),
        ["./user/dto/user-list.dto"]: await import("./user/dto/user-list.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./zakaz/dto/product-zakaz.dto"), { "DiscountZakazDTO": { value: { required: true, type: () => Number }, oldPrice: { required: true, type: () => Number } }, "ProductZakazDTO": { ean: { required: true, type: () => String }, title: { required: true, type: () => String }, shop: { required: true, type: () => String }, url: { required: true, type: () => String }, imageUrl: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, price: { required: true, type: () => Number }, discount: { required: true, type: () => t["./zakaz/dto/product-zakaz.dto"].DiscountZakazDTO, nullable: true }, volume: { required: true, type: () => Number, nullable: true }, weight: { required: true, type: () => Number, nullable: true } }, "ProductZakazListDTO": { items: { required: true, type: () => [t["./zakaz/dto/product-zakaz.dto"].ProductZakazDTO] } } }], [import("./zakaz/dto/search-query.dto"), { "SearchQueryDTO": { q: { required: true, type: () => String }, shopId: { required: false, type: () => String }, maxPrice: { required: false, type: () => Number }, discountsOnly: { required: false, type: () => Boolean } } }], [import("./zakaz/dto/shop-zakaz.dto"), { "ShopZakazDTO": { id: { required: true, type: () => String }, title: { required: true, type: () => String } }, "ShopZakazListDTO": { items: { required: true, type: () => [t["./zakaz/dto/shop-zakaz.dto"].ShopZakazDTO] } } }], [import("./shop/dto/create-shop.dto"), { "CreateShopDTO": { title: { required: true, type: () => String }, imageId: { required: false, type: () => Number }, isExternal: { required: false, type: () => Boolean }, externalId: { required: false, type: () => String } } }], [import("./shop/dto/find-shop-filters.dto"), { "FindShopFiltersDTO": { title: { required: false, type: () => String }, source: { required: false, type: () => Object, pattern: "/^(internal|external)$/i" }, limit: { required: false, type: () => Number }, page: { required: false, type: () => Number }, sortBy: { required: false, type: () => Object, pattern: "/^(id|title|isExternal|createdAt|updatedAt)$/i" }, order: { required: false, type: () => Object, pattern: "/^(asc|desc)$/i" } } }], [import("./shop/dto/update-shop.dto"), { "UpdateShopDTO": {} }], [import("./file/dto/file.dto"), { "ImageDTO": { id: { required: true, type: () => Number }, url: { required: true, type: () => String } } }], [import("./shop/dto/logo-upload.dto"), { "LogoUploadDTO": { file: { required: true, type: () => Object } } }], [import("./shop/dto/shop.dto"), { "ShopDTO": { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, isExternal: { required: true, type: () => Boolean }, imageId: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./shop/dto/shop-list.dto"), { "ShopListDTO": { totalCount: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, items: { required: true, type: () => [Object] } } }], [import("./product/dto/create-product.dto"), { "CreateProductDTO": { title: { required: true, type: () => String }, description: { required: true, type: () => String, nullable: true }, url: { required: true, type: () => String }, price: { required: true, type: () => Number }, volume: { required: true, type: () => Number, nullable: true }, weight: { required: true, type: () => Number, nullable: true }, status: { required: false, type: () => Object }, shopId: { required: true, type: () => Number }, imageId: { required: true, type: () => Number, nullable: true } } }], [import("./product/dto/find-product-filters.dto"), { "FindProductFiltersDTO": { title: { required: false, type: () => String }, shopId: { required: false, type: () => Number }, maxPrice: { required: false, type: () => Number }, discountsOnly: { required: false, type: () => Boolean }, status: { required: false, type: () => Object }, userId: { required: false, type: () => Number }, limit: { required: false, type: () => Number }, page: { required: false, type: () => Number }, sortBy: { required: false, type: () => Object, pattern: "/^(id|title|description|price|discount|oldPrice|volume|weight|status|createdAt|updatedAt|userId|shopId)$/i" }, order: { required: false, type: () => Object, pattern: "/^(asc|desc)$/i" } } }], [import("./product/dto/price-history.dto"), { "PriceHistoryItemDTO": { price: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date } }, "PriceHistoryDTO": { product: { required: true, type: () => ({ id: { required: true, type: () => Number }, title: { required: true, type: () => String } }) }, shop: { required: true, type: () => ({ id: { required: true, type: () => Number }, title: { required: true, type: () => String } }) }, priceHistory: { required: true, type: () => [Object] } } }], [import("./product/dto/report-option.dto"), { "ReportOptionDTO": { option: { required: true, enum: t["./product/dto/report-option.dto"].ReportOption } } }], [import("./product/dto/update-product.dto"), { "UpdateProductDTO": {} }], [import("./product/dto/image-upload.dto"), { "ImageUploadDTO": { file: { required: true, type: () => Object } } }], [import("./product/dto/product.dto"), { "ProductDTO": { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, url: { required: true, type: () => String }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, discount: { required: true, type: () => Number, nullable: true }, oldPrice: { required: true, type: () => Number, nullable: true }, volume: { required: true, type: () => Number, nullable: true }, weight: { required: true, type: () => Number, nullable: true }, isExternal: { required: true, type: () => Boolean }, status: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, userId: { required: true, type: () => Number, nullable: true }, shopId: { required: true, type: () => Number }, imageId: { required: true, type: () => Number, nullable: true }, shop: { required: true, type: () => ({ id: { required: true, type: () => Number }, title: { required: true, type: () => String }, image: { required: true, type: () => ({ id: { required: true, type: () => Number }, url: { required: true, type: () => String } }), nullable: true } }) }, user: { required: true, type: () => ({ id: { required: true, type: () => Number }, name: { required: true, type: () => String } }), nullable: true }, image: { required: true, type: () => ({ id: { required: true, type: () => Number }, url: { required: true, type: () => String } }), nullable: true } }, "ProductFromZakazDTO": { ean: { required: true, type: () => String }, imageUrl: { required: true, type: () => String } } }], [import("./product/dto/product-list.dto"), { "ProductListDTO": { totalCount: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, items: { required: true, type: () => [Object] } }, "GlobalProductListDTO": { totalCount: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, items: { required: true, type: () => [Object] } } }], [import("./user/dto/create-user.dto"), { "CreateUserDTO": { name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, maxLength: 30 }, role: { required: true, type: () => Object } } }], [import("./user/dto/update-user.dto"), { "UpdateUserDTO": {} }], [import("./user/dto/find-user-filters.dto"), { "FindUserFiltersDTO": { name: { required: false, type: () => String }, email: { required: false, type: () => String }, role: { required: false, type: () => Object }, limit: { required: false, type: () => Number }, page: { required: false, type: () => Number }, sortBy: { required: false, type: () => Object, pattern: "/^(id|name|email|role|createdAt|updatedAt)$/i" }, order: { required: false, type: () => Object, pattern: "/^(asc|desc)$/i" } } }], [import("./auth/dto/reset-password.dto"), { "ResetPasswordDTO": { email: { required: true, type: () => String } } }], [import("./auth/dto/auth.dto"), { "AuthDTO": { email: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, maxLength: 30 } } }], [import("./auth/dto/change-password.dto"), { "ChangePasswordDTO": { token: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, maxLength: 30 } } }], [import("./auth/dto/validate-token.dto"), { "ValidateTokenDTO": { token: { required: true, type: () => String } }, "IsValidDTO": { isValid: { required: true, type: () => Boolean } } }], [import("./user/dto/user.dto"), { "UserAuthDTO": { id: { required: true, type: () => Number }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, role: { required: true, type: () => Object } }, "UserDTO": { id: { required: true, type: () => Number }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, role: { required: true, type: () => Object }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } } }], [import("./user/dto/edit-profile.dto"), { "EditProfileDTO": { name: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 8, maxLength: 30 } } }], [import("./user/dto/user-list.dto"), { "UserListDTO": { totalCount: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number }, items: { required: true, type: () => [t["./user/dto/user.dto"].UserDTO] } } }]], "controllers": [[import("./zakaz/zakaz.controller"), { "ZakazController": { "getShops": {}, "searchProducts": {} } }], [import("./shop/shop.controller"), { "ShopController": { "find": { type: t["./shop/dto/shop-list.dto"].ShopListDTO }, "findOne": { type: t["./shop/dto/shop.dto"].ShopDTO }, "create": { type: t["./shop/dto/shop.dto"].ShopDTO }, "uploadLogo": { type: t["./file/dto/file.dto"].ImageDTO }, "update": { type: t["./shop/dto/shop.dto"].ShopDTO }, "delete": { type: t["./shop/dto/shop.dto"].ShopDTO } } }], [import("./product/product.controller"), { "ProductController": { "find": { type: t["./product/dto/product-list.dto"].ProductListDTO }, "findGlobally": { type: t["./product/dto/product-list.dto"].GlobalProductListDTO }, "findOne": { type: t["./product/dto/product.dto"].ProductDTO }, "create": { type: t["./product/dto/product.dto"].ProductDTO }, "createRequest": { type: t["./product/dto/product.dto"].ProductDTO }, "findMyRequests": { type: t["./product/dto/product-list.dto"].ProductListDTO }, "update": { type: t["./product/dto/product.dto"].ProductDTO }, "delete": { type: t["./product/dto/product.dto"].ProductDTO }, "uploadImage": { type: t["./file/dto/file.dto"].ImageDTO }, "getPriceHistoryReport": { type: t["./product/dto/price-history.dto"].PriceHistoryDTO } } }], [import("./auth/auth.controller"), { "AuthController": { "signUp": {}, "signIn": { type: Object }, "signOut": {}, "resetPassword": {}, "validateToken": {}, "changePassword": {} } }], [import("./user/user.controller"), { "UserController": { "findMe": { type: t["./user/dto/user.dto"].UserDTO }, "editProfile": { type: t["./user/dto/user.dto"].UserDTO }, "find": { type: t["./user/dto/user-list.dto"].UserListDTO }, "findOne": { type: t["./user/dto/user.dto"].UserDTO }, "create": { type: t["./user/dto/user.dto"].UserDTO }, "update": { type: t["./user/dto/user.dto"].UserDTO }, "delete": { type: t["./user/dto/user.dto"].UserDTO } } }], [import("./supermarket/supermarket.controller"), { "SupermarketController": { "signIn": { type: Object }, "signOut": {}, "createRequest": { type: t["./product/dto/product.dto"].ProductDTO }, "find": { type: t["./shop/dto/shop-list.dto"].ShopListDTO }, "uploadImage": { type: t["./file/dto/file.dto"].ImageDTO } } }]] } };
};
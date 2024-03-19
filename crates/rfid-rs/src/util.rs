mod sealed {
    /// A trait that can be implemented to limit implementations to this crate.
    /// See the [Sealed traits pattern](https://rust-lang.github.io/api-guidelines/future-proofing.html)
    /// for more info.
    pub trait Sealed {}
}

pub(crate) use sealed::Sealed;

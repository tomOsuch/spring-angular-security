package pl.tomaszosuch.springangularsecurity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.tomaszosuch.springangularsecurity.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}
